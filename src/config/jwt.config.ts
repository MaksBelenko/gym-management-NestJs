import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', (): { accessJwt: JwtConfig, refreshJwt: JwtConfig, passwordResetJwt: JwtConfig } => ({
    accessJwt: {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    },
    refreshJwt: {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    passwordResetJwt: {
        secret: process.env.JWT_PASSWORD_RESET_SECRET,
        expiresIn: process.env.JWT_PASSWORD_RESET_EXPIRES_IN,
    },
}));


export interface JwtConfig {
    secret: string;
    expiresIn: string;
}