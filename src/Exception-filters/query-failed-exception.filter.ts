import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
    logger = new Logger(QueryFailedExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        this.logger.error(`Exception details: ${exception.detail}`);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';

        if (exception.code === '23505') {
            status = HttpStatus.CONFLICT;
            message = 'Duplicate key';
        }

        if (exception.code === '23503') {
            status = HttpStatus.CONFLICT;
            message = 'Something else references the object that you are trying to delete';
        }

        response.status(status).json({
            statusCode: status,
            message: message,
        });
    }
}
