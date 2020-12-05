import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user.entity';

export const GetBearerToken = createParamDecorator((data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;
    const receivedToken = authHeader.replace('Bearer ', '');

    return receivedToken;
});