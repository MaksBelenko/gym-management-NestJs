import {  TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmConfig = {
    type: process.env.DATABASE_TYPE as any,
    host: process.env.RDS_HOSTNAME,
    port: +process.env.RDS_PORT,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: (process.env.TYPEORM_SYNC == 'true'),
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsTableName: '_migrations-' + process.env.RDS_DB_NAME,
    migrationsRun: true,
    // cli: {
    //     migrationsDir: './migrations'
    // },
};


export type TypeOrmConfig = TypeOrmModuleOptions & {
    type: any,
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
    entities: string[],
    synchronize: boolean,
    migrations: string[],
    migrationsTableName: string,
    migrationsRun: boolean,
}
