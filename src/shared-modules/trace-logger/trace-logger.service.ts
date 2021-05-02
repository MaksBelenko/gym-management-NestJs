import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as httpContext from 'express-http-context'

@Injectable()
export class TraceLoggerService extends Logger {

    private formatMessage(message: string): string {
        const traceId = httpContext.get('traceId');
        return  traceId ? `${message} \n { ${traceId} }` : message;
    };

    log(message: any, context?: string) {
        const formattedMessage = this.formatMessage(message)
        super.log(formattedMessage, `${context}`);
    }
    error(message: any, trace?: string, context?: string) {
        const formattedMessage = this.formatMessage(message)
        super.error(formattedMessage, trace, context);
    }
    warn(message: any, context?: string) {
        const formattedMessage = this.formatMessage(message)
        super.warn(formattedMessage, context);
    }
    debug(message: any, context?: string) {
        const formattedMessage = this.formatMessage(message)
        super.debug(formattedMessage, context);
    }
    verbose(message: any, context?: string) {
        const formattedMessage = this.formatMessage(message)
        super.verbose(formattedMessage, context);
    }

}
