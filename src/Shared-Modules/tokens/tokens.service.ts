import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from 'src/Shared-Modules/tokens/jwt-payload.interface';
import { JwtConfig, accessJwtConfig, refreshJwtConfig } from '../../End-Points/auth/constants/jwt.config';
import { TokensResponseDto } from '../../End-Points/auth/auth-local/dto/tokens-response.dto';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { appConfig } from '../../enviroment.consts';
import * as convertToMilliseconds from 'ms';

@Injectable()
export class TokensService {

    private readonly accessTokenTTL: number;
    private readonly refreshTokenTTL: number;

    private readonly logger = new Logger(this.constructor.name);

    constructor (
        private redisCacheService: RedisCacheService,
        private jwtService: JwtService,
    ) {
        // PassportJs uses "ms" for convertion of string to number
        this.accessTokenTTL = convertToMilliseconds(appConfig.jwt.accessToken.expiresIn) / 1000;
        this.refreshTokenTTL = convertToMilliseconds(appConfig.jwt.refreshToken.expiresIn) / 1000;
    }


    async tokenExists(bearerHeader: string): Promise<string> {
        const receivedToken = this.getTokenFromBearerHeader(bearerHeader)
        const value = this.redisCacheService.get(receivedToken);

        return (value) ? receivedToken : null;
    }

    async renewTokens(payload: JwtPayload, refreshToken: string): Promise<TokensResponseDto> {
        const currentAccessToken = await this.redisCacheService.get<any>(refreshToken);
        
        await this.redisCacheService.del(currentAccessToken.accessToken);
        await this.redisCacheService.del(refreshToken);

        return this.generateAllTokens(payload);
    }


    async generateAllTokens(payload: JwtPayload): Promise<TokensResponseDto> {
        const accessToken = await this.generateToken(payload, accessJwtConfig);
        const refreshToken = await this.generateToken(payload, refreshJwtConfig);

        const tokensDto = new TokensResponseDto(accessToken, refreshToken);

        await this.redisCacheService.set(accessToken, true ,  this.accessTokenTTL);
        await this.redisCacheService.set(refreshToken, { accessToken }, this.refreshTokenTTL);

        return tokensDto;
    }

    async generateToken(payload: JwtPayload, config: JwtConfig): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: config.secret,
            expiresIn: config.expiresIn
        });
    }

    private getTokenFromBearerHeader(header: string): string {
        if (header.includes('Bearer') == false) {
           throw new UnauthorizedException(); 
        }

        return header.replace('Bearer ', '');
    }

}
