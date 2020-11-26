import { EntityRepository, Repository } from 'typeorm';
import { JwtTokens } from './token.entity';
import { TokensResponseDto } from '../../auth/dto/tokens-response.dto';

@EntityRepository(JwtTokens)
export class JwtTokensRepository extends Repository<JwtTokens> {


    async saveTokens(tokensDto: TokensResponseDto): Promise<void> {
        const { accessToken, refreshToken } = tokensDto;

        const tokens = new JwtTokens();
        tokens.accessToken = accessToken;
        tokens.refreshToken = refreshToken;
        
        await tokens.save();
    }

}