import { NextResponse } from 'next/server';

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR'
}
import { ApiResponse } from '@/types';

export class ServerResponse {
  static success<T>(data?: T, message?: string): NextResponse {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    };
    return NextResponse.json(response);
  }

  static error(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    status: number = 500,
    details?: any
  ): NextResponse {
    const response: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details
      },
      timestamp: new Date().toISOString()
    };
    return NextResponse.json(response, { status });
  }

  static validationError(message: string, details?: any): NextResponse {
    return this.error(message, ErrorCode.VALIDATION_ERROR, 400, details);
  }

  static authenticationError(message: string = '认证失败'): NextResponse {
    return this.error(message, ErrorCode.AUTHENTICATION_ERROR, 401);
  }

  static authorizationError(message: string = '权限不足'): NextResponse {
    return this.error(message, ErrorCode.AUTHORIZATION_ERROR, 403);
  }

  static notFound(message: string = '资源未找到'): NextResponse {
    return this.error(message, ErrorCode.NOT_FOUND, 404);
  }

  static databaseError(message: string = '数据库操作失败', details?: any): NextResponse {
    return this.error(message, ErrorCode.DATABASE_ERROR, 500, details);
  }
}
