import { Body, Controller, Get, Post, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { RegisterCredentialsDto } from './dto/register-credential.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './user.entity';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { QueryFailedExceptionFilter } from '../Exception-filters/query-failed-exception.filter';
import { AccessJwtGuard } from './auth-guards/access-jwt.authguard';
import { RefreshJwtGuard } from './auth-guards/refresh-jwt.authguard';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { GetBearerToken } from './decorators/get-bearer-token.decorator';
import { RenewTokensGuard } from './auth-guards/tokens-renew.authguard';
import { MailSenderService } from '../Shared-Modules/mail-sender/mail-sender.service';

@Controller('/auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private mailSenderService: MailSenderService,
    ) {} 

    @Post('/signup')
    @UseFilters(new QueryFailedExceptionFilter())
    register(
        @Body(ValidationPipe) registerCredentialsDto: RegisterCredentialsDto,
    ): Promise<TokensResponseDto> {
        return this.authService.register(registerCredentialsDto);
    }

    @Post('/signin')
    login(
        @Body(ValidationPipe) loginCredentialsDto: LoginCredentialsDto,
    ): Promise<TokensResponseDto>  {
        return this.authService.login(loginCredentialsDto);
    }

    @Post('/renew')
    @UseGuards(RenewTokensGuard)
    renewTokens(
        @GetBearerToken() refreshObject: { refreshToken: string, email: string },
    ): Promise<TokensResponseDto> {
        return this.authService.renewTokens(refreshObject);
    }



    @Get('send-email')
    sendEmail() {
        // this.mailSenderService.sendConfirmationEmail('maksim.belenko@gmail.com', 'Maksim Belenko', '1234')

        this.mailSenderService.sendPasswordResetEmail(
            'maksim.belenko@gmail.com',
            'Maksim Belenko', 
            'https://google.com'
        );
    }

    @Post('/test')
    @UseGuards(AccessJwtGuard)
    test(@GetUser() user: User) {
        console.log(user);
    }
}
