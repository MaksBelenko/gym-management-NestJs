import { EntityRepository, Repository } from 'typeorm';
import { LocalAuthToken } from './local-auth-token.entity';

@EntityRepository(LocalAuthToken)
export class LocalAuthTokenRepository extends Repository<LocalAuthToken> {
    
}
