import { Injectable, UnauthorizedException, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { JwtPayload } from '../../../shared-modules/tokens/jwt-payload.interface';
import { UserRepository } from '../user.repository';
import { TokensService } from '../../../shared-modules/tokens/tokens.service';
import { MailSenderService } from '../../../shared-modules/mail-sender/mail-sender.service';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
// import { resetPasswordJwtConfig } from '../constants/jwt.config';
import { EmailConfirmationCodeService } from '../../../shared-modules/mail-sender/email-confirmation-codes.service';
import { JwtType } from '../../../shared/jwt-type.enum';
import serverConfiguration from 'src/config/server.config';
import { Role } from '../RBAC/role.enum';
import { JwtPasswordResetQueryParamName, JwtResetPasswordStrategy } from './passport-strategies/jwt-reset-password.strategy';
import { JwtConfirmEmailQueryParamName } from './passport-strategies/jwt-email-confirmation.strategy';
import { EmailConfirmationData } from './email-confirmation.interface';

@Injectable()
export class LocalAuthService {

    private readonly logger = new Logger(this.constructor.name);

    constructor (
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokensService,
        private readonly mailSenderService: MailSenderService,
        private readonly emailConfirmService: EmailConfirmationCodeService,
        @Inject(serverConfiguration.KEY) private readonly serverConfig: ConfigType<typeof serverConfiguration>,
    ) {}


    async register(registerCredentialsDto: RegisterCredentialsDto): Promise<void> {
        const user = await this.userRepository.registerUnconfirmedUser(registerCredentialsDto);

        const { email, fullName } = registerCredentialsDto;
        // const confirmationCode = await this.emailConfirmService.generateConfirmationCode(email)
        
        // // TODO: Remove await as there is no need to wait sending email (AND CHECK)
        // await this.mailSenderService.sendConfirmationEmail(email, fullName, confirmationCode);

        // TODO: Add interface for just email payload
        const { role } = user;
        const payload: JwtPayload = { email, role };

        const emailConfirmationJwtToken = await this.tokenService.generateJwtToken(payload, JwtType.EMAIL_CONFIRMATION);
        const baseUrl = this.serverConfig.baseUrl;
        const serverPort = this.serverConfig.port;


        this.mailSenderService.sendConfirmationEmail(
            email, 
            fullName, 
            `${baseUrl}:${serverPort}/api/auth/local/confirm-email?${JwtConfirmEmailQueryParamName}=${emailConfirmationJwtToken}`,
        );
    }

    async confirmAccount(jwtPayload: JwtPayload): Promise<EmailConfirmationData> {
        const { email } = jwtPayload;

        const user = await this.userRepository.setUserConfirmed(email);

        const responseData: EmailConfirmationData = { customerName: user.fullName };
        return responseData;
    }


    // async confirmAccount(confirmEmailDto: ConfirmEmailDto): Promise<TokensResponseDto> {
    //     const { email, code } = confirmEmailDto;
    //     const confirmationCodeMatches = await this.emailConfirmService.codeMatches(email, code);

    //     // TODO: Add logic for only 3 tries
    //     if (confirmationCodeMatches == false) {
    //         await this.userRepository.increaseConfirmationCount(email);
    //         throw new UnauthorizedException();
    //     }

    //     const user = await this.userRepository.setUserConfirmed(email);

    //     const tokens = await this.tokenService.generateAllTokens(user);
    //     return tokens;
    // }


    async login(loginCredentialsDto: LoginCredentialsDto): Promise<TokensResponseDto> {
        this.logger.log(`User with email ${loginCredentialsDto.email} is trying to signin...`)
        const user = await this.userRepository.validateUserPassword(loginCredentialsDto);

        if (!user) {
            this.logger.error(`Sending Unauthorized exception back`)
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.tokenService.generateAllTokens(user);
    }


    async logout(refreshToken: string): Promise<void> {
        return await this.tokenService.removeTokensAssociatedTo(refreshToken);
    }


    async renewTokens(refreshToken: string): Promise<TokensResponseDto> {
        return this.tokenService.renewTokens(refreshToken);
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

        const passwordResetAccessToken = await this.tokenService.generateJwtToken(payload, JwtType.PASSORD_RESET);
        const baseUrl = this.serverConfig.baseUrl;
        const serverPort = this.serverConfig.port;


        this.mailSenderService.sendPasswordResetEmail(
            email, 
            fullName, 
            `${baseUrl}:${serverPort}/api/auth/local/reset-password-token?${JwtPasswordResetQueryParamName}=${passwordResetAccessToken}`,
        );
    }

    async resetPassword(jwtPayload: JwtPayload, newPassword: string): Promise<void> {
        const { email } = jwtPayload;
        const user = await this.userRepository.findUserByEmail(email);

        await this.userRepository.changePassword(user, newPassword);
    }
}
