import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { RegisterCredentialsDto } from './dto/register-credential.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { TokensService } from '../../Shared-Modules/tokens/tokens.service';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { User } from './user.entity';
import { PasswordResetDto } from './dto/password-reset.dto';
import { MailSenderService } from '../../Shared-Modules/mail-sender/mail-sender.service';
import { resetPasswordJwtConfig } from './constants/jwt.config';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(this.constructor.name);

    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private tokenService: TokensService,
        private mailSenderService: MailSenderService,
        private configService: ConfigService,
    ) {}


    async register(registerCredentialsDto: RegisterCredentialsDto): Promise<TokensResponseDto> {
        const user = await this.userRepository.register(registerCredentialsDto);

        const { email } = user;
        const payload: JwtPayload = { email };
        return this.tokenService.generateAllTokens(payload);
    }

    async confirmAccount(registerCredentialsDto: RegisterCredentialsDto): Promise<TokensResponseDto> {
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


    async requestPasswordChange(passwordResetDto: PasswordResetDto): Promise<void> {
        const { email } = passwordResetDto;

        const user = await this.userRepository.findOne({
            where: { email }
        });

        if (!user) {
            this.logger.log(`User with email ${email} not found from users therefore no password email reset is sent`);
            return;
        }

        const { fullName } = user;
        const payload: JwtPayload = { email };

        const passwordResetAccessToken = await this.tokenService.generateToken(payload, resetPasswordJwtConfig);
        const baseUrl = this.configService.get('BASE_URL_NO_PORT');
        const serverPort = this.configService.get('PORT');


        this.mailSenderService.sendPasswordResetEmail(
            email, 
            fullName, 
            `${baseUrl}:${serverPort}/reset-password-token/${passwordResetAccessToken}`,
        );
    }

    async resetPassword(user: User, newPassword: string): Promise<void> {
        await this.userRepository.changePassword(user, newPassword);
    }
}
