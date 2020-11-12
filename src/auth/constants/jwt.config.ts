import * as config from 'config';

const refreshConf = config.get('refreshjwt');
const accessConf = config.get('accessjwt')

export const accessJwtConfig: JwtConfig = {
    secret: process.env.JWT_ACCESS_SECRET || accessConf.secret,
    expiresIn: accessConf.expiresIn
}

export const refreshJwtConfig: JwtConfig = {
    secret: process.env.JWT_REFRESH_SECRET || refreshConf.secret,
    expiresIn: refreshConf.expiresIn
}

export class JwtConfig {
    secret: string;
    expiresIn: string;
}