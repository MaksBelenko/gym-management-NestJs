import { Injectable } from '@nestjs/common';
import { LocalAuthTokenRepository } from './local-auth-token.repository';
import { User } from '../../End-Points/auth/user.entity';
import { AuthTokenType } from './auth-token.enum';
import { LocalAuthToken } from './local-auth-token.entity';

@Injectable()
export class TokenStorageService {

    constructor(
        private readonly tokenRepository: LocalAuthTokenRepository,
    ) {}

    async createToken(token: string, tokenType: AuthTokenType, user: User): Promise<LocalAuthToken> {
        return this.tokenRepository.createToken(token, tokenType, user);
    }

    async deleteToken(token: string): Promise<void> {
        return this.tokenRepository.deleteToken(token);
    }

    async tokenExists(token: string): Promise<boolean> {
        const foundToken = await this.tokenRepository.findOne(token);

        return (!foundToken === false);
    }
}
