export interface LogMessageTemplate {
    type: 'error' | 'warning' | 'info' | 'debug'; // New property to semantically categorize messages
    icon?: string;
    text: (...args: any[]) => string;
}

export const LOG_MESSAGES = {
    // =================================================================
    // General / CLI
    // =================================================================
    
    startingExclusive: {
        type: 'info',
        icon: '⚡',
        text: () => '[⚡] Exclusive mode: Terminating existing instances...',
    },
    runningInProjectScope: {
        type: 'info',
        icon: '📁',
        text: (projectName: string, path: string) => `[📁] Running tests for project "${projectName}" in: ${path}`,
    },
    projectNotFound: {
        type: 'error',
        icon: '❌',
        text: (projectName: string) => `[error] Project "${projectName}" not found in tsconfig.json or workspace definitions.`,
    },
    invalidExitCode: {
        type: 'warning',
        icon: '⚠️',
        text: (code: number) => `[warning] Exiting with an unusual code: ${code}.`,
    },
    
    // =================================================================
    // Browser Lifecycle (BrowserManager)
    // =================================================================
    
    browserManagerCleanup: {
        type: 'debug',
        icon: '🧹',
        text: () => '[debug] BrowserManager: Cleaning up browser processes.',
    },
    browserProcessTerminated: {
        type: 'debug',
        icon: '✔️',
        text: (pid: number) => `[debug] BrowserManager: Terminated process with PID: ${pid}.`,
    },
    browserCleanupFailed: {
        type: 'warning',
        icon: '⚠️',
        text: (pid: number, error: string) => `[warning] BrowserManager: Failed to terminate process ${pid}. Reason: ${error}`,
    },
    headlessModeImplied: {
        type: 'info',
        icon: 'ℹ️',
        text: () => '[ℹ️] Using --browser node implies --headless. Running in headless mode.',
    },

    // =================================================================
    // Test Runner (NodeTestRunner)
    // =================================================================
    
    noJsFilesForRunner: {
        type: 'warning',
        icon: '⚠️',
        text: () => '[warning] No JS files found for test runner generation.',
    },
    generatedInProcessRunner: {
        type: 'info',
        icon: '🤖',
        text: (runnerPath: string) => `[robot] Generated in-process test runner: ${runnerPath}`,
    },
    startingTestRunner: {
        type: 'info',
        icon: '🚀',
        text: () => '[rocket] Starting test runner in current process...',
    },
    testProcessAlreadyRunning: {
        type: 'warning',
        icon: '⚠️',
        text: () => '[warning] Test process already running.',
    },
    testExecutionError: {
        type: 'error',
        icon: '❌',
        text: (message: string) => `[error] Test execution error: ${message}`,
    },
    failedToRunTests: {
        type: 'error',
        icon: '❌',
        text: (error: string) => `[error] Failed to run tests: ${error}`,
    },
    errorDuringExecution: {
        type: 'error',
        icon: '❌',
        text: (error: string) => `[error] Error during test execution: ${error}`,
    },

    // =================================================================
    // Signal Handling & Interruptions
    // =================================================================
    
    caughtSignal: {
        type: 'info',
        icon: '⚙️',
        text: (signal: string) => `[gear] Caught ${signal}. Cleaning up...`,
    },
    abortingRun: {
        type: 'warning',
        icon: '🛑',
        text: () => '[warning] Test run aborted. Generating partial report...',
    },
    forceExiting: {
        type: 'warning',
        icon: '💥',
        text: () => '[warning] Double Ctrl+C detected. Forcing exit.',
    },
    unhandledRejection: {
        type: 'error',
        icon: '❌',
        text: (error: string) => `[error] Unhandled Rejection: ${error}`,
    },
    uncaughtException: {
        type: 'error',
        icon: '❌',
        text: (error: string) => `[error] Uncaught Exception: ${error}`,
    },
    
    // =================================================================
    // Watch Mode & HMR
    // =================================================================
    
    watchingFiles: {
        type: 'info',
        icon: '👀',
        text: () => '[👀] Watch mode enabled. Waiting for file changes...',
    },
    rebuildingDueToChange: {
        type: 'info',
        icon: '🔄',
        text: (filePath: string) => `[🔄] File change detected, rebuilding: ${filePath}`,
    },
    
    // =================================================================
    // Coverage
    // =================================================================
    
    remappingCoverage: {
        type: 'debug',
        icon: '🗺️',
        text: () => '[🗺️] Remapping coverage paths using source maps.',
    },
} as const;
