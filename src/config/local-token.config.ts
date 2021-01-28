import { registerAs } from '@nestjs/config';

export default registerAs('localTokenConfig', () => ({
    accessToken: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    },
    refreshToken: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    }
}));