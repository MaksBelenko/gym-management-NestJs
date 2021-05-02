import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRefreshToken = createParamDecorator((data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    return req.refreshToken;
});