import { EntityRepository, LessThanOrEqual, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { LocalAuthToken } from './local-auth-token.entity';
import { User } from '../../end-points/auth/user.entity';
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
            await this.delete(token);
        } catch (error) {
            this.logger.log(
                `Error deleting from database token ${token}; error = ${error}`,
            );
        }
    }

    async deleteAllTokensExpiredBefore(tokenType: AuthTokenType, beforeDate: Date): Promise<void> {
        await this.delete({
            tokenType, 
            creationDate: LessThanOrEqual(beforeDate),  
        });
    }
}
