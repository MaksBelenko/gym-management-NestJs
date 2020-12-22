import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetBearerToken = createParamDecorator((data, ctx: ExecutionContext): { refreshToken: string, email: string } => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});