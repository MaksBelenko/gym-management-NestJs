import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import GoogleUser from '../Models/google-user.model';

export const GetGoogleUser = createParamDecorator(<T>(data, ctx: ExecutionContext): T => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});