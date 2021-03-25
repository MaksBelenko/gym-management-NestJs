import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import * as pinoLogger from 'pino';
import { ASYNC_STORAGE } from './logger.constants';

const pino = pinoLogger({
    prettyPrint: true,
})

@Injectable()
export class PinoLoggerService implements LoggerService {

    constructor(
        @Inject(ASYNC_STORAGE) private readonly asyncLocalStorage: AsyncLocalStorage<Map<string, string>>,
    ) {}

    private getMessage(message: any, context?: string) {
        return context ? `[${context}] ${message}` : message;
    }
    


    error(message: any, trace?: string, context?: string) {
        const store = this.asyncLocalStorage.getStore();
        const traceId = store?.get('traceId');
        pino.error({ traceId }, this.getMessage(message, context));
        if (trace) {
            pino.error(trace);
        }
    }

    log(message: any, context?: string) {
        const traceId = this.asyncLocalStorage.getStore()?.get('traceId');
        pino.info({ traceId }, " " + this.getMessage(message, context));
    }

    warn(message: any, context?: string) {
        const traceId = this.asyncLocalStorage.getStore()?.get('traceId');
        pino.warn({ traceId }, this.getMessage(message, context));
    }


    debug?(message: any, context?: string) {
        const traceId = this.asyncLocalStorage.getStore()?.get('traceId');
        pino.info({ traceId }, this.getMessage(message, context));
    }
    verbose?(message: any, context?: string) {
        throw new Error('Method not implemented.');
    }
}
