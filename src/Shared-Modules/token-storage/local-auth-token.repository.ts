import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { LocalAuthToken } from './local-auth-token.entity';
import { User } from '../../End-Points/auth/user.entity';
import { AuthTokenType } from './auth-token.enum';

@EntityRepository(LocalAuthToken)
export class LocalAuthTokenRepository extends Repository<LocalAuthToken> {
    
    private readonly logger = new Logger(this.constructor.name);

    async createToken(tokenType: AuthTokenType, user: User): Promise<LocalAuthToken> {
        const tokenEntity = new LocalAuthToken();
        tokenEntity.tokenType = tokenType;
        tokenEntity.user = user;

        return tokenEntity.save();
    }

    async deleteToken(token: string): Promise<void> {
        try {
            const t = await this.delete(token);
        } catch (error) {
            this.logger.error(`Error deleting from database token ${token}; error = ${error}`);
        }
    }
}
