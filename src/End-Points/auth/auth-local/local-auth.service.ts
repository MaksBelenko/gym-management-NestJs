import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../Shared-Modules/tokens/jwt-payload.interface';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';
import { TokensService } from '../../../Shared-Modules/tokens/tokens.service';
import { MailSenderService } from '../../../Shared-Modules/mail-sender/mail-sender.service';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { resetPasswordJwtConfig } from '../constants/jwt.config';
import { EmailConfirmationCodeService } from '../../../Shared-Modules/mail-sender/email-confirmation-codes.service';

@Injectable()
export class LocalAuthService {

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
        
        // TODO: Remove await as there is no need to wait sending email (AND CHECK)
        await this.mailSenderService.sendConfirmationEmail(email, fullName, confirmationCode);
    }

    async confirmAccount(confirmEmailDto: ConfirmEmailDto): Promise<TokensResponseDto> {
        const { email, code } = confirmEmailDto;
        const confirmationCodeMatches = await this.emailConfirmService.codeMatches(email, code);

        // TODO: Add logic for only 3 tries
        if (confirmationCodeMatches == false) {
            throw new UnauthorizedException();
        }

        const user = await this.userRepository.setUserConfirmed(email);

        return this.getTokensFor(user);
    }


    async login(loginCredentialsDto: LoginCredentialsDto): Promise<TokensResponseDto> {
        const user = await this.userRepository.validateUserPassword(loginCredentialsDto);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.getTokensFor(user);
    }

    async renewTokens(refreshObject: { refreshToken: string, payload: JwtPayload }): Promise<TokensResponseDto> {
        const { payload, refreshToken} = refreshObject;

        return this.tokenService.renewTokens(payload, refreshToken);
    }


    async requestPasswordChange(passwordResetDto: PasswordResetDto): Promise<void> {
        const { email } = passwordResetDto;
        const user = await this.userRepository.findUserByEmail(email);

        if (!user) {
            this.logger.log(`User with email ${email} not found from users therefore no password email reset is sent`);
            return;
        }

        const { fullName, role } = user;

        // TODO: Add interface for just email payload
        const payload: JwtPayload = { email, role };

        const passwordResetAccessToken = await this.tokenService.generateToken(payload, resetPasswordJwtConfig);
        const baseUrl = this.configService.get('BASE_URL_NO_PORT');
        const serverPort = this.configService.get('PORT');


        this.mailSenderService.sendPasswordResetEmail(
            email, 
            fullName, 
            `${baseUrl}:${serverPort}/reset-password-token/${passwordResetAccessToken}`,
        );
    }

    async resetPassword(jwtPayload: JwtPayload, newPassword: string): Promise<void> {
        const { email } = jwtPayload;
        const user = await this.userRepository.findUserByEmail(email);

        await this.userRepository.changePassword(user, newPassword);
    }


    //#region Private Methods 
    private getTokensFor(user: User): Promise<TokensResponseDto> {
        const { email, role } = user;
        const payload: JwtPayload = { email, role };
        
        return this.tokenService.generateAllTokens(payload);
    }

    //#endregion
}
