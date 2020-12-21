import { appConfig } from '../../enviroment.consts';

export const accessJwtConfig: JwtConfig = {
    secret: appConfig.jwt.accessToken.secret,
    expiresIn: appConfig.jwt.accessToken.expiresIn,
}

export const refreshJwtConfig: JwtConfig = {
    secret: appConfig.jwt.refreshToken.secret,
    expiresIn: appConfig.jwt.refreshToken.expiresIn,
}

export const resetPasswordJwtConfig: JwtConfig = {
    secret: appConfig.jwt.passwordResetToken.secret,
    expiresIn: appConfig.jwt.passwordResetToken.expiresIn,
}

export class JwtConfig {
    secret: string;
    expiresIn: string;
}