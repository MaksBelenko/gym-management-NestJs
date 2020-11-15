import * as config from 'config';
import { appConfig } from '../../enviroment.consts';

const refreshConf = config.get('refreshjwt');
const accessConf = config.get('accessjwt')

export const accessJwtConfig: JwtConfig = {
    secret: appConfig.jwt.accessToken.secret,
    expiresIn: appConfig.jwt.accessToken.expiresIn,
}

export const refreshJwtConfig: JwtConfig = {
    secret: appConfig.jwt.refreshToken.secret,
    expiresIn: appConfig.jwt.refreshToken.expiresIn,
}

export class JwtConfig {
    secret: string;
    expiresIn: string;
}