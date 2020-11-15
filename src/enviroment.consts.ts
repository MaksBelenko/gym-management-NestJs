import * as config from 'config';

const serverConfig = config.get('server');
const refreshConfig = config.get('refreshjwt');
const accessConfig = config.get('accessjwt');
const dbConfig = config.get('db');

export const appConfig = {
    serverPort: process.env.PORT || serverConfig.port,
    jwt: {
        accessToken: {
            secret: process.env.JWT_ACCESS_SECRET || accessConfig.secret,
            expiresIn: accessConfig.expiresIn
        },
        refreshToken: {
            secret: process.env.JWT_REFRESH_SECRET || refreshConfig.secret,
            expiresIn: refreshConfig.expiresIn
        }
    },
    db: {
        host: process.env.RDS_HOSTNAME || dbConfig.host,
        port: process.env.RDS_PORT || dbConfig.port,
        username: process.env.RDS_USERNAME || dbConfig.username,
        password: process.env.RDS_PASSWORD || dbConfig.password,
        database: process.env.RDS_DB_NAME || dbConfig.database,
        synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
    }
};