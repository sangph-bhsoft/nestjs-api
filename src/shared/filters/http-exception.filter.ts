import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    if (error.getStatus === HttpStatus.UNAUTHORIZED) {
      if (typeof error.response !== 'string') {
        error.response['message'] =
          error.response.message ||
          'You not have permission to access this resource ';
      }
    }

    res.status(error.statusCode || error.getStatus()).json({
      statusCode: error.statusCode || error.getStatus(),
      error: (error.response && error.response.name) || error.name,
      message: (error.response && error.response.message) || error.message,
      errors: (error.response && error.response.errors) || null,
      timestamp: new Date().toISOString(),
      path: req ? req.url : null,
    });
  }
}
