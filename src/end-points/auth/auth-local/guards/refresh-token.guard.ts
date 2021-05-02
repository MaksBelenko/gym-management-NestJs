import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokenType } from '../../../../shared-modules/token-storage/auth-token.enum';
import { TokensService } from '../../../../shared-modules/tokens/tokens.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {

    constructor(
        private readonly tokenService: TokensService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;

        const refreshAuthToken = await this.tokenService.getTokenData(authHeader);

        if (!refreshAuthToken || refreshAuthToken.tokenType != AuthTokenType.REFRESH) {
            return false;
        }

        req.refreshToken = refreshAuthToken.token;

        return true;
    }
}