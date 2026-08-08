import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';
import { createServer } from 'http';
import { extname } from 'path';
import { exec } from 'child_process';   // ✅ new top‑level import
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import { logger } from './logger';
import { HttpServerMessages } from './log-messages';

interface ResolvedRequestPath {
  rootDir: string;
  resolvedPath: string;
}

interface StaticPathRoots {
  outDir: string;
  workspaceNodeModulesDir: string;
  vendorDir: string;
  assetDirs: string[];
}

export function resolveStaticRequestPath(
  filePath: string,
  roots: StaticPathRoots,
): ResolvedRequestPath {
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

  constructor(private config: ViteJasmineConfig) {}

  private createHttpServer(): http.Server {
    const outDir = path.resolve(this.config.outDir);
    const __filename = norm(fileURLToPath(import.meta.url));
    const __dirname = norm(path.dirname(__filename));
    const vendorDir = path.resolve(path.join(__dirname, '../node_modules'));
    const workspaceNodeModulesDir = path.resolve(path.join(process.cwd(), 'node_modules'));
    const packageRoot = path.resolve(path.join(__dirname, '..'));
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
        },
      );

      if (!isPathInside(rootDir, resolvedPath)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      const stream = fs.createReadStream(resolvedPath);
      stream.on('error', () => {
        res.writeHead(404);
        res.end('Not found');
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
    this.server = this.createHttpServer();

    return new Promise((resolve, reject) => {
      const tryListen = (attempt = 1) => {
        this.server!.listen(port, () => {
          logger.println(HttpServerMessages.serverRunning(port));
          resolve(this.server!);
        });

        this.server!.on('error', (error: any) => {
          if (error.code === 'EADDRINUSE' && attempt < 3) {
            logger.println(HttpServerMessages.portBusyRetrying(port));

            this.server!.close(() => {
              setTimeout(() => {
                const isWindows = process.platform === 'win32';
                const killCommand = isWindows
                  ? `powershell -command "Get-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess | Stop-Process -Force"`
                  : `lsof -ti:${port} | xargs -r kill -9`;

                // ✅ Fixed: pass empty options object as second argument
                exec(killCommand, {}, (err, stdout, stderr) => {
                  if (err) {
                    logger.error(HttpServerMessages.failedToKillProcess(port, err.message, stderr));
                  } else {
                    logger.println(HttpServerMessages.portReclaimed(port));
                  }
                  this.server = this.createHttpServer();
                  tryListen(attempt + 1);
                });
              }, 3000);
            });
          } else if (error.code === 'EADDRINUSE') {
            logger.error(HttpServerMessages.portStillBusy(port));
            reject(error);
          } else {
            logger.error(HttpServerMessages.serverError(error));
            reject(error);
          }
        });
      };
      tryListen();
    });
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
      } catch {
        await new Promise(r => setTimeout(r, 100));
      }
    }
    throw new Error(`Server not ready at ${url} after ${timeout}ms`);
  }

  async cleanup(): Promise<void> {
    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server!.close(err => (err ? reject(err) : resolve()));
      });
      this.server = null;
    }
  }
}
