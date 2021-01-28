import { AuthTokenType } from '../token-storage/auth-token.enum';
import { User } from '../../End-Points/auth/user.entity';
import { LocalAuthToken } from '../token-storage/local-auth-token.entity';

export abstract class TokenStorage {
    abstract createToken(token: string, tokenType: AuthTokenType, user: User): Promise<LocalAuthToken>;
    abstract deleteToken(token: string): Promise<void>;
    abstract tokenExists(token: string): Promise<boolean>;
}