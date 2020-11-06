import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    statusCode: number;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => ({
                statusCode: context.switchToHttp().getResponse().statusCode,
                data: data || {},
            })),
        );
    }
}
//   @Injectable()
//   export class TransformInterceptor<T>
//     implements NestInterceptor<T, Response<T>> {
//     intercept(
//       context: ExecutionContext,
//       next: CallHandler,
//     ): Observable<Response<T>> {
//       return next.handle().pipe(map((data) => ({
//         statusCode: context.switchToHttp().getResponse().statusCode,
//         message: data.message
//         data: {
//           result: data.result,
//           meta: {} // if this is supposed to be the actual return then replace {} with data.result
//         }
//       })))
//     }
//   }
