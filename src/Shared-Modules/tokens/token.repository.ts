import { EntityRepository, Repository } from 'typeorm';
import { JwtTokens } from './token.entity';
import { TokensResponseDto } from '../../auth/dto/tokens-response.dto';

@EntityRepository(JwtTokens)
export class JwtTokensRepository extends Repository<JwtTokens> {


    async saveToken(refreshToken: string, expiresAt: number): Promise<void> {
        const tokens = new JwtTokens();
        tokens.refreshToken = refreshToken;
        tokens.expiresAt = expiresAt;
        
        await tokens.save();
    }

    
    async deleteExpiredTokens(): Promise<void> {

        const datenow = Math.floor(Date.now()/1000.0);

        await this.createQueryBuilder()
                    .delete()
                    .from(JwtTokens)
                    .where('expiresAt < :datenow', { datenow })
                    .execute();
    }

}