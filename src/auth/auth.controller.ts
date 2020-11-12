import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard, AccessJwtGuard, RefreshJwtGuard } from './auth-guards/jwt.authguard';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { JwtRefreshStrategy as RefreshJwtStrategy } from './passport-strategies/jwt-refresh.strategy';
import { JwtAccessStrategy } from './passport-strategies/jwt-access.strategy';

@Controller('/auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {} 

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<TokensResponseDto>  {
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(RefreshJwtGuard)
    test(@GetUser() user: User) {
        console.log(user);
    }
}
