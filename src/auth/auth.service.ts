import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { RegisterCredentialsDto } from './dto/register-credential.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { TokensService } from '../Shared-Modules/tokens/tokens.service';
import { User } from './user.entity';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { RedisCacheService } from '../Shared-Modules/redis-cache/redis-cache.service';

@Injectable()
export class AuthService {

    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private tokenService: TokensService,
        private redisCacheService: RedisCacheService
    ) {}


    async register(registerCredentialsDto: RegisterCredentialsDto): Promise<TokensResponseDto> {
        const user = await this.userRepository.register(registerCredentialsDto);

        const { email } = user;
        const payload: JwtPayload = { email };
        return this.tokenService.generateAllTokens(payload);
    }


    async login(loginCredentialsDto: LoginCredentialsDto): Promise<TokensResponseDto> {
        const email = await this.userRepository.validateUserPassword(loginCredentialsDto);

        if (!email) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { email };
        return this.tokenService.generateAllTokens(payload);
    }

    async tokenRefresh(refreshToken: string): Promise<TokensResponseDto> {
        return new TokensResponseDto("test", "test");
    }





    async checkRedis(value: { test: string }): Promise<any> {
        return this.redisCacheService.set(value.test, {
            revoked: true,
            blocked: "yes",
        });
    }

    async getRedis(value: string): Promise<any> {
        return this.redisCacheService.get(value)
    }

}
