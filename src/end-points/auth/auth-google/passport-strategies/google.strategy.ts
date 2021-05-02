import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Strategy } from 'passport-google-oauth20';
import GoogleUser from '../models/google-user.model';
import googleConfiguration from 'src/config/google.config';
import serverConfiguration from 'src/config/server.config';
import { GoogleAuthController } from '../google-auth.controller';

// config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    @Inject(googleConfiguration.KEY) private readonly googleConfig: ConfigType<typeof googleConfiguration>,
    @Inject(serverConfiguration.KEY) private readonly serverConfig: ConfigType<typeof serverConfiguration>,
  ) {
    super({
      clientID: googleConfig.clientId,
      clientSecret: googleConfig.secret,
      callbackURL: `${serverConfig.baseUrl}:${serverConfig.port}/api/google/redirect`,
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