export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode?: number
  public readonly isOperational: boolean
  public readonly timestamp: Date

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode?: number,
    isOperational = true
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.timestamp = new Date()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Error de conexión. Verifica tu internet.') {
    super(message, ErrorCode.NETWORK_ERROR)
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'La solicitud tardó demasiado. Intenta de nuevo.') {
    super(message, ErrorCode.TIMEOUT_ERROR)
  }
}

export class ValidationError extends AppError {
  public readonly fields?: Record<string, string>

  constructor(message: string, fields?: Record<string, string>) {
    super(message, ErrorCode.VALIDATION_ERROR, 400)
    this.fields = fields
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Sesión expirada. Inicia sesión nuevamente.') {
    super(message, ErrorCode.UNAUTHORIZED, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'No tienes permisos para realizar esta acción.') {
    super(message, ErrorCode.FORBIDDEN, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'El recurso solicitado no existe.') {
    super(message, ErrorCode.NOT_FOUND, 404)
  }
}

export class ServerError extends AppError {
  constructor(message = 'Error del servidor. Intenta más tarde.') {
    super(message, ErrorCode.SERVER_ERROR, 500)
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as { issues: Array<{ message: string }> }
    return zodError.issues[0]?.message || 'Error de validación'
  }

  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Error desconocido'
}
