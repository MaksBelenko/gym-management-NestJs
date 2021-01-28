import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../../Shared-Modules/tokens/jwt-payload.interface';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): JwtPayload => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});