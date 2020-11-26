import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtConfig, accessJwtConfig, refreshJwtConfig } from '../../auth/constants/jwt.config';
import { TokensResponseDto } from '../../auth/dto/tokens-response.dto';
import { JwtTokensRepository } from './token.repository';

@Injectable()
export class TokensService {

    constructor (
        private jwtService: JwtService,
        @InjectRepository(JwtTokensRepository)
        private tokenRepository: JwtTokensRepository,
    ) {}


    async refreshTokenExists(bearerHeader: string): Promise<boolean> {
        const retrievedToken = bearerHeader.replace('Bearer ', '');

        const token = await this.tokenRepository.findOne({
            where: {
                refreshToken: retrievedToken,
            }
        });

        return (token) ? true : false;
    }

    async generateAllTokens(payload: JwtPayload): Promise<TokensResponseDto> {
        const accessToken = await this.generateToken(payload, accessJwtConfig);
        const refreshToken = await this.generateToken(payload, refreshJwtConfig);

        const tokensDto = new TokensResponseDto(accessToken, refreshToken);
        await this.tokenRepository.saveTokens(tokensDto);

        return tokensDto;
    }

    private async generateToken(payload: JwtPayload, config: JwtConfig): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: config.secret,
            expiresIn: config.expiresIn
        });
    }
}
