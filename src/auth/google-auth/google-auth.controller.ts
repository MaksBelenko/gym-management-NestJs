import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../auth-guards/google.authguard';
import { GoogleAuthService } from './google-auth.service';

@Controller('google')
export class GoogleAuthController {

    constructor(private readonly googleService: GoogleAuthService) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
      
  }

  

  // @Get('redirect')
  // @UseGuards(GoogleAuthGuard)
  // googleAuthRedirect(@Req() req) {
  //   return this.googleService.googleLogin(req)
  // }
}
