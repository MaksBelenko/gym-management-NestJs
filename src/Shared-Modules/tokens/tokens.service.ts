import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/End-Points/auth/jwt-payload.interface';
import { JwtConfig, accessJwtConfig, refreshJwtConfig } from '../../End-Points/auth/constants/jwt.config';
import { TokensResponseDto } from '../../End-Points/auth/auth-local/dto/tokens-response.dto';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class TokensService {

    private oneDay: number = 60 * 60 * 24; // 1 day for Redis
    private oneMinute = 60; // 60s for Redis

    private readonly logger = new Logger(TokensService.name);

    constructor (
        private redisCacheService: RedisCacheService,
        private jwtService: JwtService,
    ) {}


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

        await this.redisCacheService.set(accessToken, true ,  this.oneMinute);
        await this.redisCacheService.set(refreshToken, { accessToken }, 30 * this.oneDay);

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
