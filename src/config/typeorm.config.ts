import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { appConfig } from '../enviroment.consts';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: appConfig.db.host,
    port: appConfig.db.port,
    username: appConfig.db.username,
    password: appConfig.db.password,
    database: appConfig.db.database,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: appConfig.db.synchronize,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsTableName: appConfig.db.database,
    migrationsRun: true,
    // cli: {
    //     migrationsDir: './migrations'
    // },
};

