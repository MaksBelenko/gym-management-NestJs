import { AuthTokenType } from '../token-storage/auth-token.enum';
import { User } from '../../End-Points/auth/user.entity';
import { LocalAuthToken } from '../token-storage/local-auth-token.entity';

export abstract class TokenStorage {
    abstract createToken(tokenType: AuthTokenType, user: User): Promise<LocalAuthToken>;
    abstract deleteToken(token: string): Promise<void>;
    abstract getToken(token: string): Promise<LocalAuthToken>;
    abstract getTokenThrows(token: string): Promise<LocalAuthToken>;
    abstract getReferenceTokenFor(token: string): Promise<string>;
}