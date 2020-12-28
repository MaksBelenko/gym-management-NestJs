import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { TokensService } from '../../Shared-Modules/tokens/tokens.service';
import { MailSenderService } from '../../Shared-Modules/mail-sender/mail-sender.service';
import { RegisterCredentialsDto } from './dto/register-credential.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { resetPasswordJwtConfig } from './constants/jwt.config';
import { EmailConfirmationCodeService } from '../../Shared-Modules/mail-sender/email-confirmation-codes.service';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(this.constructor.name);

    constructor (
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokensService,
        private readonly mailSenderService: MailSenderService,
        private readonly configService: ConfigService,
        private readonly emailConfirmService: EmailConfirmationCodeService,
    ) {}


    async register(registerCredentialsDto: RegisterCredentialsDto): Promise<void> {
        const user = await this.userRepository.registerUnconfirmedUser(registerCredentialsDto);

        const { email, fullName } = registerCredentialsDto;
        const confirmationCode = await this.emailConfirmService.generateConfirmationCode(email)
        
        await this.mailSenderService.sendConfirmationEmail(email, fullName, confirmationCode);
    }

    async confirmAccount(confirmEmailDto: ConfirmEmailDto): Promise<TokensResponseDto> {
        const { email, code } = confirmEmailDto;
        const confirmationCodeMatches = await this.emailConfirmService.codeMatches(email, code);

        if (confirmationCodeMatches == false) {
            throw new UnauthorizedException();
        }

        await this.userRepository.setUserConfirmed(email);

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
