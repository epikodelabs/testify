import * as tty from 'tty';
import { LOG_MESSAGES, LogMessageTemplate } from './messages';

// ANSI color codes
const colors = {
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
};

type LogMessageKey = keyof typeof LOG_MESSAGES;

class Logger {
    private readonly isTty: boolean;

    constructor() {
        // Detect if stdout is a TTY to determine if we can use rich formatting
        this.isTty = tty.isatty(process.stdout.fd);
    }

    public log<T extends LogMessageKey>(key: T, ...args: Parameters<(typeof LOG_MESSAGES)[T]['text']>) {
        const template: LogMessageTemplate = LOG_MESSAGES[key];
        const rawMessage = template.text(...args);

        const { formattedMessage, stream } = this.format(rawMessage, template);
        
        stream.write(formattedMessage + '\n');
    }

    private format(rawMessage: string, template: LogMessageTemplate): { formattedMessage: string; stream: NodeJS.WriteStream } {
        const { type, icon } = template;
        let color = colors.reset;
        let stream: NodeJS.WriteStream = process.stdout;
        let messageContent = rawMessage;

        // Determine color and stream based on the message type
        switch (type) {
            case 'error':
                color = colors.red;
                stream = process.stderr;
                break;
            case 'warning':
                color = colors.yellow;
                break;
            case 'info':
                color = colors.cyan;
                break;
            case 'debug':
                color = colors.blue;
                break;
        }
        
        if (this.isTty) {
            const iconStr = icon ? `${icon} ` : '';
            // For TTY, replace the textual prefix (e.g., "[robot]") with the icon and apply color.
            const prefixMatch = rawMessage.match(/^\[.*?\]\s*(.*)/);
            messageContent = (prefixMatch && prefixMatch[1]) ? prefixMatch[1] : rawMessage;
            return { formattedMessage: `${color}${iconStr}${messageContent}${colors.reset}`, stream };
        }

        // For ASCII, the raw message already contains the desired textual prefix.
        return { formattedMessage: rawMessage, stream };
    }
}

// Export a singleton instance for project-wide use
export const logger = new Logger();