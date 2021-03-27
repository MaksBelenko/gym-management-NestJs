import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-payload.interface';
import { JwtType } from '../../shared/jwt-type.enum';
import { TokensResponseDto } from '../../End-Points/auth/auth-local/dto/tokens-response.dto';
import jwtConfiguration, { JwtConfig } from '../../config/jwt.config';
import { AuthTokenType } from '../token-storage/auth-token.enum';
import { User } from '../../End-Points/auth/user.entity';
import { TokenStorage } from './token-storage.abstract';
import { LocalAuthToken } from '../token-storage/local-auth-token.entity';


@Injectable()
export class TokensService {
    private jwtConfigRecord: Record<JwtType, JwtConfig>;
    private readonly logger = new Logger(this.constructor.name);

    constructor (
        @Inject(TokenStorage) private readonly tokenStorage: TokenStorage,
        private jwtService: JwtService,
        @Inject(jwtConfiguration.KEY) private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    ) {
        this.configureJwtConfigRecord();
    }


    async getTokenData(bearerHeader: string): Promise<LocalAuthToken> {
        const receivedToken = this.getTokenFromBearerHeader(bearerHeader);

        return this.tokenStorage.getToken(receivedToken);
    }

    async removeTokensAssociatedTo(refreshToken: string): Promise<void> {
        const currentAccessToken = await this.tokenStorage.getReferenceTokenFor(refreshToken);

        await this.tokenStorage.deleteToken(refreshToken);
        await this.tokenStorage.deleteToken(currentAccessToken);
    }

    async renewTokens(refreshTokenValue: string): Promise<TokensResponseDto> {
        const { user } = await this.tokenStorage.getToken(refreshTokenValue);

        if (!user) {
            throw new UnauthorizedException();
        }

        await this.removeTokensAssociatedTo(refreshTokenValue);
        return this.generateAllTokens(user);
    }


    async generateAllTokens(user: User): Promise<TokensResponseDto> {
        const accessTokenEntity = await this.tokenStorage.createToken(AuthTokenType.ACCESS, user);
        const refreshTokenEntity = await this.tokenStorage.createToken(AuthTokenType.REFRESH, user);

        refreshTokenEntity.referenceToken = accessTokenEntity;
        await refreshTokenEntity.save();
        
        this.logger.log(`Generated new tokens for ${user.email}`);
        const tokensDto = new TokensResponseDto(accessTokenEntity.token, refreshTokenEntity.token);

        return tokensDto;
    }

    async generateJwtToken(payload: JwtPayload, jwtType: JwtType): Promise<string> {
        const config = this.getJwtConfigFor(jwtType);

        return this.jwtService.sign(payload, {
            secret: config.secret,
            expiresIn: config.expiresIn
        });
    }




    //#region Private Methods

    private configureJwtConfigRecord() {
        this.jwtConfigRecord = {
            // [JwtType.ACCESS]: this.jwtConfig.accessJwt,
            // [JwtType.REFRESH]: this.jwtConfig.refreshJwt,
            [JwtType.PASSORD_RESET]: this.jwtConfig.passwordResetJwt,
        }
    }

    private getJwtConfigFor(jwtType: JwtType): JwtConfig {
        return this.jwtConfigRecord[jwtType];
    }

    private getTokenFromBearerHeader(header: string): string {
        if (!header || header.includes('Bearer') == false) {
           throw new UnauthorizedException(); 
        }

        return header.replace('Bearer ', '');
    }

    //#endregion

}
