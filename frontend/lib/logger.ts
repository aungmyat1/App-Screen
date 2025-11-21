// Logging utility for structured logging and monitoring

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private static instance: Logger;
  private minLevel: LogLevel = 'info';
  
  private constructor() {
    // Set minimum log level based on environment
    if (typeof window !== 'undefined') {
      this.minLevel = (window as any).ENV?.LOG_LEVEL || 'info';
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatLog(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      timestamp: entry.timestamp.toISOString(),
    });
  }

  debug(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('debug')) return;
    
    const entry: LogEntry = {
      level: 'debug',
      message,
      timestamp: new Date(),
      context,
    };
    
    console.debug(this.formatLog(entry));
  }

  info(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('info')) return;
    
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: new Date(),
      context,
    };
    
    console.info(this.formatLog(entry));
  }

  warn(message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog('warn')) return;
    
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: new Date(),
      context,
      stack: error?.stack,
    };
    
    console.warn(this.formatLog(entry));
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog('error')) return;
    
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date(),
      context,
      stack: error?.stack,
    };
    
    console.error(this.formatLog(entry));
    
    // In production, also send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorTracking(entry);
    }
  }

  private sendToErrorTracking(entry: LogEntry): void {
    // In a real implementation, this would send logs to a service like Sentry
    // Example:
    // if ((window as any).Sentry) {
    //   (window as any).Sentry.captureMessage(entry.message, {
    //     level: entry.level,
    //     contexts: {
    //       logContext: entry.context,
    //     },
    //     user: {
    //       id: entry.userId,
    //     }
    //   });
    // }
    
    console.debug('Would send to error tracking service:', entry);
  }

  setUser(userId: string): void {
    // Set user context for error tracking
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.setUser({ id: userId });
    }
  }

  setSession(sessionId: string): void {
    // Set session context for error tracking
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.setContext('session', { id: sessionId });
    }
  }
}

export default Logger.getInstance();

// Convenience functions
export const logDebug = (message: string, context?: Record<string, any>) => Logger.getInstance().debug(message, context);
export const logInfo = (message: string, context?: Record<string, any>) => Logger.getInstance().info(message, context);
export const logWarn = (message: string, context?: Record<string, any>, error?: Error) => Logger.getInstance().warn(message, context, error);
export const logError = (message: string, context?: Record<string, any>, error?: Error) => Logger.getInstance().error(message, context, error);