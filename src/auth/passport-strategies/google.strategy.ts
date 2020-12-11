import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import GoogleUser from '../Models/google-user.model';

// config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    private configService: ConfigService
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: `${configService.get('BASE_URL_NO_PORT')}:${configService.get('PORT')}/api/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, emails, photos } = profile

    const user: GoogleUser = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      pictureUrl: photos[0].value,
      // accessToken
    }

    return user;
  }
}