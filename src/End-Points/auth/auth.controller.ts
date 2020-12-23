import { Body, Controller, Param, Post, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { RegisterCredentialsDto } from './dto/register-credential.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './user.entity';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { QueryFailedExceptionFilter } from '../../Exception-filters/query-failed-exception.filter';
import { AccessJwtGuard } from './auth-guards/access-jwt.authguard';
import { RefreshJwtGuard } from './auth-guards/refresh-jwt.authguard';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { GetBearerToken } from './decorators/get-bearer-token.decorator';
import { RenewTokensGuard } from './auth-guards/tokens-renew.authguard';
import { PasswordResetDto } from './dto/password-reset.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Controller('/auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) {} 

    @Post('/signup')
    @UseFilters(new QueryFailedExceptionFilter())
    register(
        @Body(ValidationPipe) registerCredentialsDto: RegisterCredentialsDto,
    ): Promise<void> {
        return this.authService.register(registerCredentialsDto);
    }


    @Post('/confirm-email')
    confirmEmail(
        @Body(ValidationPipe) confirmEmailDto: ConfirmEmailDto,
    ): Promise<TokensResponseDto> {
        return this.authService.confirmAccount(confirmEmailDto);
    }


    @Post('/signin')
    login(
        @Body(ValidationPipe) loginCredentialsDto: LoginCredentialsDto,
    ): Promise<TokensResponseDto>  {
        return this.authService.login(loginCredentialsDto);
    }


    @Post('/token-refresh')
    @UseGuards(RenewTokensGuard)
    renewTokens(
        @GetBearerToken() refreshObject: { refreshToken: string, email: string },
    ): Promise<TokensResponseDto> {
        return this.authService.renewTokens(refreshObject);
    }


    @Post('/password-reset-request')
    requestPasswordChange(
        @Body(ValidationPipe) passwordResetDto: PasswordResetDto,
    ): Promise<void> {
        return this.authService.requestPasswordChange(passwordResetDto);
    }
    

    @Post('/reset-password')
    @UseGuards(AccessJwtGuard)
    resetPassword(
        @GetUser() user: User,
        @Param('newPassword') newPassword: string,
    ): Promise<void> {
        return this.authService.resetPassword(user, newPassword);
    }


    @Post('/test')
    @UseGuards(AccessJwtGuard)
    test(@GetUser() user: User) {
        console.log(user);
    }
}
