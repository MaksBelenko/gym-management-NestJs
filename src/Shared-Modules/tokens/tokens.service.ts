import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-payload.interface';
import { JwtType } from '../../shared/jwt-type.enum';
import { TokensResponseDto } from '../../End-Points/auth/auth-local/dto/tokens-response.dto';
import * as convertToMilliseconds from 'ms';
import jwtConfiguration, { JwtConfig } from '../../config/jwt.config';
import { TokenStorageService } from '../token-storage/token-storage.service';

@Injectable()
export class TokensService {

    private readonly accessTokenTTL: number;
    private readonly refreshTokenTTL: number;
    private jwtConfigRecord: Record<JwtType, JwtConfig>;

    private readonly logger = new Logger(this.constructor.name);

    constructor (
        private readonly tokenStorageService: TokenStorageService,
        private jwtService: JwtService,
        @Inject(jwtConfiguration.KEY) private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    ) {
        // PassportJs uses "ms" for convertion of string to number
        this.accessTokenTTL = convertToMilliseconds(jwtConfig.accessJwt.expiresIn) / 1000;
        this.refreshTokenTTL = convertToMilliseconds(jwtConfig.refreshJwt.expiresIn) / 1000;

        this.configureJwtConfigRecord();
    }


    async tokenExists(bearerHeader: string): Promise<string> {
        const receivedToken = this.getTokenFromBearerHeader(bearerHeader)
        const tokenExists = await this.tokenStorageService.tokenExists(receivedToken);

        return (tokenExists) ? receivedToken : null;
    }

    async renewTokens(payload: JwtPayload, refreshToken: string): Promise<TokensResponseDto> {
        // const currentAccessToken = await this.redisCacheService.get<any>(refreshToken);
        
        // await this.redisCacheService.del(currentAccessToken.accessToken);
        // await this.redisCacheService.del(refreshToken);

        return this.generateAllTokens(payload);
    }


    async generateAllTokens(payload: JwtPayload): Promise<TokensResponseDto> {
        const accessToken = await this.generateToken(payload,  JwtType.ACCESS);
        const refreshToken = await this.generateToken(payload, JwtType.REFRESH);

        const tokensDto = new TokensResponseDto(accessToken, refreshToken);

        // const accessTokenEntity = await this.tokenStorageService.createToken(accessToken, JwtType.ACCESS, user);
        // const refreshTokenEntity = await this.tokenStorageService.createToken(refreshToken, JwtType.REFRESH, user);

        // await this.redisCacheService.set(accessToken, true ,  this.accessTokenTTL);
        // await this.redisCacheService.set(refreshToken, { accessToken }, this.refreshTokenTTL);

        return tokensDto;
    }

    async generateToken(payload: JwtPayload, jwtType: JwtType): Promise<string> {
        const config = this.getJwtConfigFor(jwtType);

        return this.jwtService.sign(payload, {
            secret: config.secret,
            expiresIn: config.expiresIn
        });
    }


    //#region Private Methods

    private configureJwtConfigRecord() {
        this.jwtConfigRecord = {
            [JwtType.ACCESS]: this.jwtConfig.accessJwt,
            [JwtType.REFRESH]: this.jwtConfig.refreshJwt,
            [JwtType.PASSORD_RESET]: this.jwtConfig.passwordResetJwt,
        }
    }

    private getJwtConfigFor(jwtType: JwtType): JwtConfig {
        return this.jwtConfigRecord[jwtType];
    }

    private getTokenFromBearerHeader(header: string): string {
        if (header.includes('Bearer') == false) {
           throw new UnauthorizedException(); 
        }

        return header.replace('Bearer ', '');
    }

    //#endregion

}
