import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtConfig, accessJwtConfig, refreshJwtConfig } from '../../auth/constants/jwt.config';
import { TokensResponseDto } from '../../auth/dto/tokens-response.dto';
import { JwtTokensRepository } from './token.repository';
import { appConfig } from '../../enviroment.consts';
import * as moment from 'moment';

@Injectable()
export class TokensService {

    private readonly logger = new Logger(TokensService.name);

    constructor (
        private jwtService: JwtService,
        @InjectRepository(JwtTokensRepository)
        private tokenRepository: JwtTokensRepository,
    ) {}


    // @Cron('*/30 * * * *')    // Every 30 mins
    @Cron(CronExpression.EVERY_MINUTE)
    async cleanupExpiredTokens() {
        this.tokenRepository.deleteExpiredTokens();
    }


    async refreshTokenExists(bearerHeader: string): Promise<boolean> {
        const receivedToken = bearerHeader.replace('Bearer ', '');

        const token = await this.tokenRepository.findOne({
            where: {
                refreshToken: receivedToken,
            }
        });

        return (token) ? true : false;
    }

    async generateAllTokens(payload: JwtPayload): Promise<TokensResponseDto> {
        const accessToken = await this.generateToken(payload, accessJwtConfig);
        const refreshToken = await this.generateToken(payload, refreshJwtConfig);

        const tokensDto = new TokensResponseDto(accessToken, refreshToken);
        await this.tokenRepository.saveTokens(tokensDto, this.getExpirationDateForRefreshToken());

        return tokensDto;
    }

    private async generateToken(payload: JwtPayload, config: JwtConfig): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: config.secret,
            expiresIn: config.expiresIn
        });
    }


    private getExpirationDateForRefreshToken(): number {
        const now = Date.now();

        // TODO: Change expiration time to the same as in config
        const expiryDate = moment(now).add(1, 'minutes').toDate();

        return Math.floor(expiryDate.getTime()/1000.0); // epoch
    }
}
