import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { TokensService } from '../../../../Shared-Modules/tokens/tokens.service';
import { AuthTokenType } from '../../../../Shared-Modules/token-storage/auth-token.enum';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly tokenService: TokensService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }
        
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;

        const accessAuthToken = await this.tokenService.getTokenData(authHeader);

        if (!accessAuthToken || accessAuthToken.tokenType != AuthTokenType.ACCESS) {
            return false;
        }

        if (!accessAuthToken.user) {
            return false;
        }

        req.user = accessAuthToken.user;

        return true;
    }
}
