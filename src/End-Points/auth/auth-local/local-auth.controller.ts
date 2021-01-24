import { Body, Controller, Post, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { LocalAuthService } from './local-auth.service';
import { GetJwtPayload } from '../decorators/get-user.decorator';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { QueryFailedExceptionFilter } from '../../../Exception-filters/query-failed-exception.filter';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { GetRefreshToken } from '../decorators/get-bearer-token.decorator';
import { PasswordResetDto } from './dto/password-reset.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ResetPasswordJwtGuard } from './guards/reset-password-jwt.guard';
import { Roles } from '../RBAC/roles.decorator';
import { Role } from '../RBAC/role.enum';
import { AuthPolicy, Auth } from '../decorators/auth.guard';
import { JwtPayload } from '../../../Shared-Modules/tokens/jwt-payload.interface';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';


// @Auth(AuthPolicy.Local)
@UseFilters(new QueryFailedExceptionFilter())
@Controller('/auth/local')
export class LocalAuthController {

    constructor(
        private localAuthService: LocalAuthService,
    ) {} 


    @Post('/signup')
    register(
        @Body(ValidationPipe) registerCredentialsDto: RegisterCredentialsDto,
    ): Promise<void> {
        return this.localAuthService.register(registerCredentialsDto);
    }


    @Post('/confirm-email')
    confirmEmail(
        @Body(ValidationPipe) confirmEmailDto: ConfirmEmailDto,
    ): Promise<TokensResponseDto> {
        return this.localAuthService.confirmAccount(confirmEmailDto);
    }


    @Post('/signin')
    login(
        @Body(ValidationPipe) loginCredentialsDto: LoginCredentialsDto,
    ): Promise<TokensResponseDto>  {
        return this.localAuthService.login(loginCredentialsDto);
    }


    @Post('/token-refresh')
    @UseGuards(RefreshJwtGuard)
    renewTokens(
        @GetRefreshToken() refreshToken: string,
        @GetJwtPayload() payload: JwtPayload,
    ): Promise<TokensResponseDto> {
        return this.localAuthService.renewTokens(refreshToken, payload);
    }


    @Post('/password-reset-request')
    requestPasswordChange(
        @Body(ValidationPipe) passwordResetDto: PasswordResetDto,
    ): Promise<void> {
        return this.localAuthService.requestPasswordChange(passwordResetDto);
    }
    

    @Post('/reset-password/:token')
    @UseGuards(ResetPasswordJwtGuard)
    resetPassword(
        @GetJwtPayload() jwtPayload: JwtPayload,
        @Body('new-password') newPassword: string,
    ): Promise<void> {
        return this.localAuthService.resetPassword(jwtPayload, newPassword);
    }


    @Post('/test')
    @Roles(Role.User)
    @Auth(AuthPolicy.Local)
    // @UseGuards(UserAuthGuard)
    test(@GetJwtPayload() jwtPayload: JwtPayload) {
        return jwtPayload;
    }
}
