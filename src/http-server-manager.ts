import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';
import { createServer } from 'http';
import { extname } from 'path';
import { exec } from 'child_process';   // ✅ new top‑level import
import { ViteJasmineConfig } from './vite-jasmine-config';
import { EXIT_CODES, ExitCodeError } from './exit-codes';
import { norm } from './utils';
import { logger } from './logger';
import { HttpServerMessages } from './log-messages';
import { resolveJasmineBrowserAssetDir } from './jasmine-browser-assets';

interface ResolvedRequestPath {
  rootDir: string;
  resolvedPath: string;
}

interface StaticPathRoots {
  outDir: string;
  workspaceNodeModulesDir: string;
  vendorDir: string;
  assetDirs: string[];
  jasmineAssetDir: string | null;
}

export function resolveStaticRequestPath(
  filePath: string,
  roots: StaticPathRoots,
): ResolvedRequestPath {
  if (
    filePath.startsWith(
      '/__testify/jasmine/',
    )
  ) {
    const relativePath =
      filePath.replace(
        /^\/__testify\/jasmine\//,
        '',
      );
    const jasmineAssetDir =
      roots.jasmineAssetDir ??
      path.resolve(
        roots.vendorDir,
        'jasmine-core/lib/jasmine-core',
      );

    return {
      rootDir: jasmineAssetDir,
      resolvedPath: path.normalize(
        path.resolve(
          jasmineAssetDir,
          relativePath,
        ),
      ),
    };
  }

  if (filePath.startsWith('/node_modules/')) {
    const relativePath =
      filePath.replace(
        /^\/node_modules\//,
        '',
      );

    const resolvedCandidate = [
      roots.workspaceNodeModulesDir,
      roots.vendorDir,
    ]
      .map((candidateRoot) => ({
        rootDir: candidateRoot,
        resolvedPath: path.resolve(
          candidateRoot,
          relativePath,
        ),
      }))
      .find((candidate) =>
        isPathInside(
          candidate.rootDir,
          candidate.resolvedPath,
        ) &&
        fs.existsSync(
          candidate.resolvedPath,
        ),
      );

    return {
      rootDir:
        resolvedCandidate?.rootDir ??
        roots.workspaceNodeModulesDir,
      resolvedPath: path.normalize(
        resolvedCandidate?.resolvedPath ??
          path.resolve(
            roots.workspaceNodeModulesDir,
            relativePath,
          ),
      ),
    };
  }

  if (filePath === '/favicon.ico') {
    const faviconCandidate =
      roots.assetDirs
        .map((assetDir) => ({
          rootDir: assetDir,
          resolvedPath: path.resolve(
            assetDir,
            'favicon.ico',
          ),
        }))
        .find((candidate) =>
          isPathInside(
            candidate.rootDir,
            candidate.resolvedPath,
          ) &&
          fs.existsSync(
            candidate.resolvedPath,
          ),
        );

    if (faviconCandidate) {
      return {
        rootDir:
          faviconCandidate.rootDir,
        resolvedPath: path.normalize(
          faviconCandidate.resolvedPath,
        ),
      };
    }
  }

  if (filePath.startsWith('/assets/')) {
    const relativePath =
      filePath.replace(
        /^\/assets\//,
        '',
      );

    const assetCandidate =
      roots.assetDirs
        .map((assetDir) => ({
          rootDir: assetDir,
          resolvedPath: path.resolve(
            assetDir,
            relativePath,
          ),
        }))
        .find((candidate) =>
          isPathInside(
            candidate.rootDir,
            candidate.resolvedPath,
          ) &&
          fs.existsSync(
            candidate.resolvedPath,
          ),
        );

    if (assetCandidate) {
      return {
        rootDir: assetCandidate.rootDir,
        resolvedPath: path.normalize(
          assetCandidate.resolvedPath,
        ),
      };
    }

    return {
      rootDir: path.resolve(
        roots.outDir,
        'assets',
      ),
      resolvedPath: path.normalize(
        path.resolve(
          roots.outDir,
          `.${filePath}`,
        ),
      ),
    };
  }

  return {
    rootDir: roots.outDir,
    resolvedPath: path.normalize(
      path.resolve(
        roots.outDir,
        `.${filePath}`,
      ),
    ),
  };
}

function isPathInside(
  root: string,
  candidate: string,
): boolean {
  const relative = path.relative(
    path.resolve(root),
    path.resolve(candidate),
  );

  return (
    relative === '' ||
    (!relative.startsWith('..') &&
      !path.isAbsolute(relative))
  );
}

export class HttpServerManager {
  private server: http.Server | null = null;
  /** Incremented by cleanup(); retry timers compare to detect shutdown. */
  private listenGeneration = 0;
  private starting: Promise<http.Server> | null = null;
  private cancelStart: (() => void) | null = null;
  private retryTimer: NodeJS.Timeout | undefined;

  constructor(private config: ViteJasmineConfig) {}

  private createHttpServer(): http.Server {
    const outDir = path.resolve(this.config.outDir);
    const __filename = norm(fileURLToPath(import.meta.url));
    const __dirname = norm(path.dirname(__filename));
    const vendorDir = path.resolve(path.join(__dirname, '../node_modules'));
    const workspaceNodeModulesDir = path.resolve(path.join(process.cwd(), 'node_modules'));
    const packageRoot = path.resolve(path.join(__dirname, '..'));
    const jasmineAssetDir =
      resolveJasmineBrowserAssetDir();
    const assetDirs = [
      path.resolve(outDir, 'assets'),
      path.resolve(process.cwd(), 'assets'),
      path.resolve(packageRoot, 'assets'),
    ];

    return createServer((req, res) => {
      let { pathname } = parse(req.url === '/' ? '/index.html' : req.url!, true);
      const filePath = decodeURIComponent(pathname!);

      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
      }

      const {
        rootDir,
        resolvedPath,
      } = resolveStaticRequestPath(
        filePath,
        {
          outDir,
          workspaceNodeModulesDir,
          vendorDir,
          assetDirs,
          jasmineAssetDir,
        },
      );

      if (!isPathInside(rootDir, resolvedPath)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      const stream = fs.createReadStream(resolvedPath);
      stream.on('error', (error: NodeJS.ErrnoException) => {
        if (res.headersSent) {
          logger.error(HttpServerMessages.staticFileReadFailed(resolvedPath, error));
          res.destroy(error);
          return;
        }
        // A missing file is a normal 404; anything else (EACCES, EMFILE,
        // EISDIR) is a host-side failure that must not masquerade as one, or
        // users chase phantom module-load errors in the page.
        if (error.code === 'ENOENT') {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        logger.error(HttpServerMessages.staticFileReadFailed(resolvedPath, error));
        res.writeHead(500);
        res.end('Internal server error');
      });
      stream.on('open', () => {
        const ext = extname(resolvedPath);
        res.writeHead(200, {
          'Content-Type': this.getContentType(ext),
          'Access-Control-Allow-Origin': '*'
        });
        stream.pipe(res);
      });
    });
  }

  async startServer(): Promise<http.Server> {
    const port = this.config.port ?? 8888;
    // Re-entrant calls (a second start() on the same manager) must reuse the
    // live listener instead of colliding with it and triggering the EADDRINUSE
    // recovery path against our own server.
    if (this.server?.listening) return this.server;
    if (this.starting) return this.starting;
    // Bumped by cleanup(); pending retry timers compare against it so a
    // shut-down manager cannot resurrect a brand-new listener.
    const generation = ++this.listenGeneration;
    this.server = this.createHttpServer();

    const starting = new Promise<http.Server>((resolve, reject) => {
      this.cancelStart = () => reject(new ExitCodeError(EXIT_CODES.INTERNAL_ERROR, 'Server startup cancelled during cleanup'));
      const tryListen = (attempt = 1) => {
        const server = this.server!;
        server.listen(port, () => {
          if (generation !== this.listenGeneration) return;
          logger.preparationStep('PORT', HttpServerMessages.portAcquired(port), true);
          resolve(server);
        });

        this.server!.on('error', (error: any) => {
          if (error.code === 'EADDRINUSE' && attempt < 3) {
            logger.preparationStep('PORT', HttpServerMessages.portBusyRetrying(port));

            server.close(() => {
              this.retryTimer = setTimeout(() => {
                if (generation !== this.listenGeneration) return;
                const isWindows = process.platform === 'win32';
                const pidCommand = isWindows
                  ? `powershell -command "(Get-NetTCPConnection -LocalPort ${port}).OwningProcess"`
                  : `lsof -ti:${port}`;

                exec(pidCommand, {}, (pidError, pidStdout) => {
                  if (generation !== this.listenGeneration) return;
                  const pids = [...new Set((pidStdout ?? '').trim().split(/\s+/).map(Number))];
                  if (pidError || pids.length === 0 || pids.some(pid => !Number.isSafeInteger(pid) || pid <= 0)) {
                    reject(new ExitCodeError(EXIT_CODES.CONFIG_ERROR, `Unable to identify the owner of port ${port}; choose another port with --port.`, { cause: pidError ?? error }));
                    return;
                  }
                  if (pids.includes(process.pid)) {
                    // Killing "whatever holds the port" would kill Testify
                    // itself; fail fast instead.
                    logger.error(HttpServerMessages.portHeldByThisProcess(port));
                    reject(new ExitCodeError(
                      EXIT_CODES.CONFIG_ERROR,
                      `Port ${port} is already in use by this process.`,
                      { cause: error },
                    ));
                    return;
                  }

                  const killCommand = isWindows
                    ? `powershell -command "Stop-Process -Id ${pids.join(',')} -Force"`
                    : `kill -9 ${pids.join(' ')}`;

                  exec(killCommand, {}, (err, _stdout, _stderr) => {
                    if (generation !== this.listenGeneration) return;
                    if (err) {
                      // Retrying after a failed kill only re-runs the same
                      // doomed sequence; surface the environment problem.
                      logger.error(HttpServerMessages.failedToReleasePort(port));
                      reject(new ExitCodeError(
                        EXIT_CODES.CONFIG_ERROR,
                        `Unable to release port ${port} held by another process.`,
                        { cause: err },
                      ));
                      return;
                    }
                    logger.preparationStep('PORT', HttpServerMessages.portReclaimed(port));
                    this.server = this.createHttpServer();
                    tryListen(attempt + 1);
                  });
                });
              }, 3000);
            });
          } else if (error.code === 'EADDRINUSE') {
            // A busy port is an environment/configuration problem, not a
            // Testify defect.
            logger.error(HttpServerMessages.portStillBusy(port));
            reject(new ExitCodeError(
              EXIT_CODES.CONFIG_ERROR,
              `Port ${port} is still in use after the reclaim attempt.`,
              { cause: error },
            ));
          } else {
            logger.error(HttpServerMessages.serverError(error));
            reject(error);
          }
        });
      };
      tryListen();
    });
    this.starting = starting;
    try {
      return await starting;
    } finally {
      this.starting = null;
      this.cancelStart = null;
    }
  }

  private getContentType(ext: string): string {
    const types: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.mjs': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    return types[ext] || 'application/octet-stream';
  }

  async waitForServerReady(url: string, timeout = 5000): Promise<void> {
    const start = Date.now();
    const { hostname, port } = new URL(url);
    let lastError: unknown;

    while (Date.now() - start < timeout) {
      try {
        await new Promise<void>((resolve, reject) => {
          const req = http.request({
            hostname,
            port,
            path: '/',
            method: 'HEAD',
            timeout: 1000
          }, (res) => {
            res.resume();
            resolve();
          });

          req.on("error", reject);
          req.on("timeout", () => {
            req.destroy();
            reject(new Error('Timeout'));
          });

          req.end();
        });
        return;
      } catch (error) {
        // Connection refusals are the expected transient state while the
        // server binds; keep the last one for the timeout diagnosis instead
        // of dumping a stack per 100ms probe.
        lastError = error;
        await new Promise(r => setTimeout(r, 100));
      }
    }
    throw new Error(`Server not ready at ${url} after ${timeout}ms`, { cause: lastError });
  }

  async cleanup(): Promise<void> {
    this.listenGeneration++;
    clearTimeout(this.retryTimer);
    this.cancelStart?.();
    const server = this.server;
    this.server = null;
    if (server?.listening) {
      await new Promise<void>((resolve, reject) => {
        server.close(err => (err ? reject(err) : resolve()));
      });
    }
  }
}
