export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private readonly isDevelopment = import.meta.env.DEV

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level}]`

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, ...args)
        break
      case LogLevel.INFO:
        console.info(prefix, message, ...args)
        break
      case LogLevel.WARN:
        console.warn(prefix, message, ...args)
        break
      case LogLevel.ERROR:
        console.error(prefix, message, ...args)
        break
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, ...args)
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      this.log(LogLevel.INFO, message, ...args)
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      this.log(LogLevel.WARN, message, ...args)
    }
  }

  error(message: string, ...args: unknown[]): void {
    this.log(LogLevel.ERROR, message, ...args)
  }
}

export const logger = new Logger()
