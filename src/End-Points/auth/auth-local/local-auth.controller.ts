import { Body, Controller, Post, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { LocalAuthService } from './local-auth.service';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../user.entity';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { QueryFailedExceptionFilter } from '../../../Exception-filters/query-failed-exception.filter';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { GetBearerToken } from '../decorators/get-bearer-token.decorator';
import { RenewTokensGuard } from './guards/tokens-renew.guard';
import { PasswordResetDto } from './dto/password-reset.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { IsPublicRoute } from '../decorators/public.decorator';
import { ResetPasswordJwtGuard } from './guards/reset-password-jwt.guard';
import { Roles } from '../RBAC/roles.decorator';
import { Role } from '../RBAC/role.enum';
import { UserAuthGuard } from './guards/user-auth.guard';


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
    @UseGuards(ResetPasswordJwtGuard)
    resetPassword(
        @GetUser() user: User,
        @Body('new-password') newPassword: string,
    ): Promise<void> {
        return this.localAuthService.resetPassword(user, newPassword);
    }


    @Post('/test')
    @Roles(Role.Admin)
    @UseGuards(UserAuthGuard)
    // @UseGuards(RolesGuard)
    // @UseGuards(AccessJwtGuard)
    test(@GetUser() user: User) {
        return user;
    }
}
