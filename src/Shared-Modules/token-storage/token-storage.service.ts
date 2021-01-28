import { Connection } from 'typeorm';
import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as convertToMilliseconds from 'ms';
import { LocalAuthTokenRepository } from './local-auth-token.repository';
import { User } from '../../End-Points/auth/user.entity';
import { AuthTokenType } from './auth-token.enum';
import { LocalAuthToken } from './local-auth-token.entity';
import { TokenStorage } from '../tokens/token-storage.abstract';
import localTokenConfiguration from '../../config/local-token.config';

@Injectable()
export class TokenStorageService extends TokenStorage {

    private readonly logger = new Logger(this.constructor.name);
    private readonly tokenRepository: LocalAuthTokenRepository;
    private readonly accessTokenTTLMillisec: number;
    private readonly refreshTokenTTLMillisec: number;

    constructor(
        private readonly connection: Connection,
        @Inject(localTokenConfiguration.KEY) private readonly localTokenConfig: ConfigType<typeof localTokenConfiguration>,
    ) {
        super();
        // Workaround for issue with "findOne" throwing error
        this.tokenRepository = this.connection.getCustomRepository(LocalAuthTokenRepository);

        this.accessTokenTTLMillisec = convertToMilliseconds(localTokenConfig.accessToken.expiresIn);
        this.refreshTokenTTLMillisec = convertToMilliseconds(localTokenConfig.refreshToken.expiresIn);
    }


    @Cron(CronExpression.EVERY_MINUTE, {
        name: 'clear-expired-token-from-db',
    })
    private async triggerClearExpiredTokens() {
        this.logger.log(`CRON_JOB: Clearing expired tokens from DB started...`);

        const accessTokenExpireBefore = new Date(Date.now() - this.accessTokenTTLMillisec);
        await this.tokenRepository.deleteAllTokensExpiredBefore(AuthTokenType.ACCESS, accessTokenExpireBefore)

        const refreshTokenExpireBefore = new Date(Date.now() - this.refreshTokenTTLMillisec);
        await this.tokenRepository.deleteAllTokensExpiredBefore(AuthTokenType.REFRESH, refreshTokenExpireBefore)
    }




    async createToken(tokenType: AuthTokenType, user: User): Promise<LocalAuthToken> {
        return this.tokenRepository.createToken(tokenType, user);
    }

    async deleteToken(token: string): Promise<void> {
        return this.tokenRepository.deleteToken(token);
    }

    async getToken(token: string): Promise<LocalAuthToken> {
        try {
            return this.tokenRepository.findOne(token);
        } catch (error) {
            return null;
        }
    }

    async getReferenceTokenFor(token: string): Promise<string> {
        const foundToken = await this.tokenRepository.findOne(token);

        if (!foundToken) {
            throw new NotFoundException();
        }
        
        return foundToken.relatedReferenceTokenId;
    }
}
