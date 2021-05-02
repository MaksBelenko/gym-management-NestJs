import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google.guard';
import { GoogleAuthService } from './google-auth.service';
import GoogleUser from './models/google-user.model';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('/auth/google')
export class GoogleAuthController {

  constructor(
    private readonly googleService: GoogleAuthService,
  ) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
      
  }

  @Get('/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(
    @GetUser() user: GoogleUser,
    @Res() res,
  ) {
    // return this.authService.register(registerCredentialsDto);
    return user;// this.googleService.googleLogin(req)
  }
}
