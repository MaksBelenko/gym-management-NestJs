import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', (): { passwordResetJwt: JwtConfig, confirmEmailJwt: JwtConfig } => ({
    passwordResetJwt: {
        secret: process.env.JWT_PASSWORD_RESET_SECRET,
        expiresIn: process.env.JWT_PASSWORD_RESET_EXPIRES_IN,
    },
    confirmEmailJwt: {
        secret: process.env.JWT_EMAIL_CONFIRM_SECRET,
        expiresIn: process.env.JWT_EMAIL_CONFIRM_EXPIRES_IN,
    },
}));


export interface JwtConfig {
    secret: string;
    expiresIn: string;
}