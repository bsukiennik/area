import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const res = exception.getResponse() as any;

    if (res && typeof res === 'object' && typeof res.error === 'string' && !res.message) {
      return response.status(status).json({ error: res.error });
    }
    if (res && typeof res === 'object' && res.error === 'Invalid request') {
      return response.status(status).json({ error: 'Invalid request' });
    }
    if (status === 400) {
      return response.status(400).json({ error: 'Invalid request' });
    }

    return response.status(status).json(res);
  }
}
