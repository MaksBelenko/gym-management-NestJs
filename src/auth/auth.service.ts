import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { RegisterCredentialsDto } from './dto/register-credential.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { TokensService } from '../Shared-Modules/tokens/tokens.service';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Injectable()
export class AuthService {

    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private tokenService: TokensService,
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

    async renewTokens(refreshObject: { refreshToken: string, email: string }): Promise<TokensResponseDto> {
        const { email } = refreshObject;
        const payload: JwtPayload = { email };

        return this.tokenService.renewTokens(payload, refreshObject.refreshToken);
    }

}
