import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, registerAs } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GymClassesModule } from './End-Points/gym-classes/gym-classes.module';
import { TrainersModule } from './End-Points/trainers/trainers.module';
import { AuthModule } from './End-Points/auth/auth.module';
import { GymSessionsModule } from './End-Points/gym-sessions/gym-sessions.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                PORT: Joi.number().positive().required(),
                BASE_URL: Joi.string().required(),

                DATABASE_TYPE: Joi.string().required(),
                RDS_HOSTNAME: Joi.string().required(),
                RDS_PORT: Joi.number().positive().required(),
                RDS_USERNAME: Joi.string().required(),
                RDS_PASSWORD: Joi.required(),
                RDS_DB_NAME: Joi.string().required(),
                TYPEORM_SYNC: Joi.boolean().required(),

                MAIL_RESPONSE_NAME: Joi.string().required(),
                MAIL_RESPONSE_EMAIL: Joi.string().email().required(), //.pattern(EmailRegex)
            }),
            // isGlobal: true
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        ScheduleModule.forRoot(),
        GymClassesModule, 
        TrainersModule, 
        GymSessionsModule, 
        AuthModule,
    ],
})
export class AppModule {}
