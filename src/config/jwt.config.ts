import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', (): { passwordResetJwt: JwtConfig } => ({
    passwordResetJwt: {
        secret: process.env.JWT_PASSWORD_RESET_SECRET,
        expiresIn: process.env.JWT_PASSWORD_RESET_EXPIRES_IN,
    },
}));


export interface JwtConfig {
    secret: string;
    expiresIn: string;
}