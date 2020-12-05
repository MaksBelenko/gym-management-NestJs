import { Body, Controller, Post, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { RegisterCredentialsDto } from './dto/register-credential.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './user.entity';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { QueryFailedExceptionFilter } from '../Exception-filters/query-failed-exception.filter';
import { AccessJwtGuard } from './auth-guards/access-jwt.authguard';
import { RefreshJwtGuard } from './auth-guards/refresh-jwt.authguard';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Controller('/auth')
export class AuthController {

    constructor(
        private authService: AuthService
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

    @Post('/refresh')
    @UseGuards(RefreshJwtGuard)
    refreshTokens(
        @GetUser() user: User,
    ): Promise<TokensResponseDto> {
        return this.authService.tokenRefreshForUser(user);
    } 

    @Post('/test')
    @UseGuards(AccessJwtGuard)
    test(@GetUser() user: User) {
        console.log(user);
    }
}
