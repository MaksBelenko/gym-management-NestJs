import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../auth-guards/google.authguard';
import { GoogleAuthService } from './google-auth.service';
import GoogleUser from '../Models/google-user.model';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthService } from '../auth.service';
import { RegisterCredentialsDto } from '../dto/register-credential.dto';

@Controller('google')
export class GoogleAuthController {

  constructor(
    private readonly googleService: GoogleAuthService,
    private authService: AuthService,
  ) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
      
  }

  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(
    @GetUser() user: GoogleUser,
    @Res() res,
  ) {
    // return this.authService.register(registerCredentialsDto);
    // return user;// this.googleService.googleLogin(req)
  }
}
