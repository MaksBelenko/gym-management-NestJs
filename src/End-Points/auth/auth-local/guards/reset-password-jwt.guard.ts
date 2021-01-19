import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtResetPasswordStrategyName } from '../passport-strategies/jwt-reset-password.strategy';

@Injectable()
export class ResetPasswordJwtGuard extends AuthGuard(JwtResetPasswordStrategyName) {


    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const id = params.token; // automatically parsed

        return super.canActivate(context);
    }
}