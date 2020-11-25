import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtConfig, accessJwtConfig, refreshJwtConfig } from '../../auth/constants/jwt.config';
import { TokensResponseDto } from '../../auth/dto/tokens-response.dto';

@Injectable()
export class TokensService {

    constructor (
        private jwtService: JwtService,
    ) {}


    async generateAllTokens(payload: JwtPayload): Promise<TokensResponseDto> {
        const accessToken = await this.generateToken(payload, accessJwtConfig);
        const refreshToken = await this.generateToken(payload, refreshJwtConfig);

        return new TokensResponseDto(accessToken, refreshToken);
    }

    private async generateToken(payload: JwtPayload, config: JwtConfig): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: config.secret,
            expiresIn: config.expiresIn
        });
    }
}
