import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
    logger = new Logger('ResponseTimeInterceptor');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        return next
            .handle()
            .pipe(tap(() => this.logger.log(`Response time = ${Date.now() - now}ms`)));
    }
}
