import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtEmailConfirmationStrategyName } from '../passport-strategies/jwt-email-confirmation.strategy';

@Injectable()
export class EmailConfirmationJwtGuard extends AuthGuard(JwtEmailConfirmationStrategyName) {

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const id = params.token; // automatically parsed

        return super.canActivate(context);
    }
}