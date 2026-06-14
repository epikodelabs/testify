import { fileURLToPath } from 'url';
import { CLIHandler } from './cli-handler';

export { BrowserManager } from './browser-manager';
export { CLIHandler } from './cli-handler';
export { Logger } from './logger';
export { ConfigManager } from './config-manager';
export { ConsoleReporter } from './console-reporter';
export { CompoundReporter } from './compound-reporter';
export { FileDiscoveryService } from './file-discovery-service';
export { HtmlGenerator } from './html-generator';
export { HttpServerManager } from './http-server-manager';
export { NodeTestRunner } from './node-test-runner';
export { WebSocketManager } from './websocket-manager';
export { IstanbulInstrumenter } from './istanbul-instrumenter'
export { HmrManager } from './hmr-manager';
export { EXIT_CODES, ExitCodeError, getExitCode, getSignalExitCode } from './exit-codes';
export { norm } from './utils';
export { ViteConfigBuilder } from './vite-config-builder';
export type { ViteJasmineConfig } from './vite-jasmine-config';
export { ViteJasmineRunner } from './vite-jasmine-runner';

// === CLI Entry Point ===
// @vite-ignore
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  CLIHandler.run().then((code) => process.exit(code)).catch(() => process.exit(1));
}
