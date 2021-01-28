import { Injectable, NotFoundException } from '@nestjs/common';
import { LocalAuthTokenRepository } from './local-auth-token.repository';
import { User } from '../../End-Points/auth/user.entity';
import { AuthTokenType } from './auth-token.enum';
import { LocalAuthToken } from './local-auth-token.entity';
import { TokenStorage } from '../tokens/token-storage.abstract';
import { Connection } from 'typeorm';

@Injectable()
export class TokenStorageService extends TokenStorage {

    private readonly tokenRepository: LocalAuthTokenRepository

    constructor(
        private readonly connection: Connection,
    ) {
        super();
        // Workaround for issue with "findOne" throwing error
        this.tokenRepository = this.connection.getCustomRepository(LocalAuthTokenRepository);
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
