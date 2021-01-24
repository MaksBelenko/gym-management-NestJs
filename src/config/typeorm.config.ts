import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: process.env.DATABASE_TYPE as any,
    host: process.env.RDS_HOSTNAME,
    port: +process.env.RDS_PORT,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: (process.env.TYPEORM_SYNC == 'true'),
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsTableName: process.env.RDS_DB_NAME,
    migrationsRun: true,
    // cli: {
    //     migrationsDir: './migrations'
    // },
};

