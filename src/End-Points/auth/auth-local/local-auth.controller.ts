import { Body, Controller, Param, Post, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { LocalAuthService } from './local-auth.service';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../user.entity';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { QueryFailedExceptionFilter } from '../../../Exception-filters/query-failed-exception.filter';
import { AccessJwtGuard } from './auth-guards/access-jwt.authguard';
import { RefreshJwtGuard } from './auth-guards/refresh-jwt.authguard';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { GetBearerToken } from '../decorators/get-bearer-token.decorator';
import { RenewTokensGuard } from './auth-guards/tokens-renew.authguard';
import { PasswordResetDto } from './dto/password-reset.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { IsPublicRoute } from '../decorators/public.decorator';


@UseFilters(new QueryFailedExceptionFilter())
@Controller('/auth/local')
export class LocalAuthController {

    constructor(
        private localAuthService: LocalAuthService,
    ) {} 


    @IsPublicRoute()
    @Post('/signup')
    register(
        @Body(ValidationPipe) registerCredentialsDto: RegisterCredentialsDto,
    ): Promise<void> {
        return this.localAuthService.register(registerCredentialsDto);
    }


    @IsPublicRoute()
    @Post('/confirm-email')
    confirmEmail(
        @Body(ValidationPipe) confirmEmailDto: ConfirmEmailDto,
    ): Promise<TokensResponseDto> {
        return this.localAuthService.confirmAccount(confirmEmailDto);
    }


    @IsPublicRoute()
    @Post('/signin')
    login(
        @Body(ValidationPipe) loginCredentialsDto: LoginCredentialsDto,
    ): Promise<TokensResponseDto>  {
        return this.localAuthService.login(loginCredentialsDto);
    }


    @IsPublicRoute(false)
    @Post('/token-refresh')
    @UseGuards(RenewTokensGuard)
    renewTokens(
        @GetBearerToken() refreshObject: { refreshToken: string, email: string },
    ): Promise<TokensResponseDto> {
        return this.localAuthService.renewTokens(refreshObject);
    }


    @IsPublicRoute()
    @Post('/password-reset-request')
    requestPasswordChange(
        @Body(ValidationPipe) passwordResetDto: PasswordResetDto,
    ): Promise<void> {
        return this.localAuthService.requestPasswordChange(passwordResetDto);
    }
    

    @Post('/reset-password')
    @UseGuards(AccessJwtGuard)
    resetPassword(
        @GetUser() user: User,
        @Body('new-password') newPassword: string,
    ): Promise<void> {
        return this.localAuthService.resetPassword(user, newPassword);
    }


    @Post('/test')
    @UseGuards(AccessJwtGuard)
    test(@GetUser() user: User) {
        console.log(user);
    }
}
