import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const message = typeof exceptionResponse === 'string' 
      ? exceptionResponse 
      : exceptionResponse.message || 'Something went wrong';

    const errors = exceptionResponse.message && Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message 
      : [];

    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message[0] : message,
      code: exception instanceof HttpException ? exception.name : 'INTERNAL_SERVER_ERROR',
      errors: errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
