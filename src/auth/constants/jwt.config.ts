export const accessJwtConfig: JwtConfig = {
    secret: 'CHANGE_SECRET_ACESS',
    expiresIn: '5m'
}

export const refreshJwtConfig: JwtConfig = {
    secret: 'CHANGE_SECRET_REFRESH',
    expiresIn: '365d'
}

export class JwtConfig {
    secret: string;
    expiresIn: string;
}