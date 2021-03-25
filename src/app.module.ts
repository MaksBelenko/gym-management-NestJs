import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GymClassesModule } from './End-Points/gym-classes/gym-classes.module';
import { TrainersModule } from './End-Points/trainers/trainers.module';
import { AuthModule } from './End-Points/auth/auth.module';
import { GymSessionsModule } from './End-Points/gym-sessions/gym-sessions.module';
import { JoiValidationSchema } from './env-validation.schema';
import { TraceLoggerModule } from './Shared-Modules/trace-logger/trace-logger.module';
@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: JoiValidationSchema,
            // isGlobal: true
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        ScheduleModule.forRoot(),
        GymClassesModule, 
        TrainersModule, 
        GymSessionsModule, 
        AuthModule, 
        // PinoLoggerModule, 
        TraceLoggerModule, 
    ],
})
export class AppModule {}
