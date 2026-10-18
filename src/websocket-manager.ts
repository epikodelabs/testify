import { EventEmitter } from 'events';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import JSONCleaner from './json-cleaner';
import { Reporter } from './compound-reporter';
import { HmrManager, HmrUpdate } from './hmr-manager';
import { FileDiscoveryService } from './file-discovery-service';
import { ViteJasmineConfig } from './vite-jasmine-config';
import path from 'path';
import { logger } from './logger';
import { WebSocketMessages } from './log-messages';

export class WebSocketManager extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private wsClients: WebSocket[] = [];
  private hmrManager: HmrManager | null = null;
  private hmrEnabled: boolean = false;
  private jsonCleaner = new JSONCleaner();
  private failedSpecsCount: number = 0;
  private pendingSpecsCount: number = 0;
  private cleanupPromise: Promise<void> | null = null;

  constructor(private fileDiscovery: FileDiscoveryService, private config: ViteJasmineConfig, private server: http.Server, private reporter: Reporter) {
    super();
    this.createWebSocketServer();
  }

  private createWebSocketServer(): void {
    this.wss = new WebSocketServer({ server: this.server });
    
    this.wss.on('error', (error) => {
      logger.error(WebSocketMessages.websocketError(error));
    });
    this.wss.on('connection', (ws: WebSocket) => {
      this.wsClients.push(ws);
      
      ws.on('message', (data: Buffer) => {
        try {
          const message = this.jsonCleaner.parse(data.toString());
          this.handleWebSocketMessage(message);
        } catch (error) {
          logger.error(WebSocketMessages.failedToParseMessage(error));
        }
      });
      
      ws.on('close', () => {
        this.wsClients = this.wsClients.filter(client => client !== ws);
      });
      
      ws.on('error', (error) => {
        logger.error(WebSocketMessages.websocketError(error));
        this.wsClients = this.wsClients.filter(client => client !== ws);
      });
      // Install message/error listeners before the asynchronous scan. Fast
      // clients can report results while discovery is still pending.
      if (this.hmrEnabled) {
        this.notifyHmrConnection(ws).catch((error) => {
          logger.error(WebSocketMessages.websocketError(error));
        });
      }
    });
  }

  private async notifyHmrConnection(ws: WebSocket): Promise<void> {
    let specFiles: string[] = [];
    try {
      const files = await this.fileDiscovery.scanDir(this.config.outDir, '/**/*.{js,mjs}');
      specFiles = files.filter(file => /\.spec\.(?:js|mjs)$/i.test(file)).map(file => path.basename(file)).sort();
    } catch (error) {
      logger.error(WebSocketMessages.hmrScanFailed(error));
    }
    this.sendToClient(ws, { type: 'hmr:connected', specFiles, enabled: true });
  }

  private handleWebSocketMessage(message: any): void {
    try {
      switch (message.type) {
        case 'userAgent':
          (this.reporter as any)?.userAgent?.(message.data, message.data.orderedSuites, message.data.orderedSpecs);
          break;

        case 'jasmineStarted':
          this.failedSpecsCount = 0;
          this.pendingSpecsCount = 0;
          // Browser reporters wrap Jasmine's suite info in `data`; passing
          // the transport envelope hides `order.random` and `order.seed`.
          this.reporter?.jasmineStarted(message.data ?? message);
          break;
        
        case 'suiteStarted':
          this.reporter?.suiteStarted(message);
          break;
        
        case 'specStarted':
          this.reporter?.specStarted(message);
          break;
        
        case 'specDone':
          const specStatus = message.status ?? message.overallStatus;
          if (specStatus === 'failed') this.failedSpecsCount++;
          if (specStatus === 'pending') this.pendingSpecsCount++;
          this.reporter?.specDone(message);
          break;
        
        case 'suiteDone':
          this.reporter?.suiteDone(message);
          break;

        case 'jasmineDone':
          this.reporter?.jasmineDone(message);

          // A malformed coverage payload must not turn a green run into a
          // failure: report it and still emit testsCompleted with no coverage.
          let coverage: unknown = null;
          if (message.coverage) {
            try {
              coverage = this.jsonCleaner.parse(message.coverage);
            } catch (error) {
              logger.error(WebSocketMessages.coverageParseFailed(error));
            }
          }
          const globalFailureCount =
            Array.isArray(
              message.failedExpectations,
            )
              ? message.failedExpectations.length
              : 0;
          const success = (message.overallStatus === 'passed' || message.overallStatus === 'incomplete') && this.failedSpecsCount === 0 && globalFailureCount === 0;
          const hasPending = message.overallStatus === 'incomplete' || this.pendingSpecsCount > 0;
          this.emit('testsCompleted', { success, hasPending, coverage });
          break;

        case 'session:exit':
          this.emit('sessionExitRequested');
          break;

        case 'hmr:ready':
          logger.println(WebSocketMessages.hmrClientReady());
          break;

        case 'hmr:error':
          logger.error(WebSocketMessages.hmrClientError(message.error));
          break;
          
        default:
          logger.warn(WebSocketMessages.unknownMessageType(message.type));
      }
    } catch (error) {
      logger.error(WebSocketMessages.errorHandlingMessage(error));
    }
  }

  // New method to enable HMR
  enableHmr(hmrManager: HmrManager): void {
    this.hmrManager = hmrManager;
    this.hmrEnabled = true;

    // Listen for HMR updates from the file watcher
    this.hmrManager.on('hmr:update', (update: HmrUpdate) => {
      this.broadcast({
        type: 'hmr:update',
        data: update,
      });
    });
    this.hmrManager.on('hmr:error', (error: unknown) => {
      this.broadcast({ type: 'hmr:error', error: error instanceof Error ? error.message : String(error) });
    });

    logger.preparationStep('HMR', WebSocketMessages.hmrEnabled());
  }

  private broadcast(message: any): void {
    const data = JSON.stringify(message);
    this.wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  private sendToClient(client: WebSocket, message: any): void {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  async cleanup(): Promise<void> {
    this.cleanupPromise ??= this.closeResources();
    return this.cleanupPromise;
  }

  private async closeResources(): Promise<void> {
    let watcherFailure: unknown;
    if (this.hmrManager) {
      try {
        await this.hmrManager.stop();
      } catch (error) {
        watcherFailure = error;
      }
      this.hmrManager = null;
    }

    if (this.wsClients.length > 0) {
      for (const client of this.wsClients) {
        try {
          if (client.readyState === WebSocket.OPEN) client.close();
        } catch (err) {
          logger.error(WebSocketMessages.errorClosingClient(err));
        }
      }
      this.wsClients = [];
    }

    if (this.wss) {
      const wss = this.wss;
      await new Promise<void>(resolve => {
        const timer = setTimeout(() => {
          for (const client of wss.clients) client.terminate();
        }, 1000);
        wss.close(() => {
          clearTimeout(timer);
          resolve();
        });
      });
      this.wss = null;
    }
    if (watcherFailure) throw watcherFailure;
  }
}
