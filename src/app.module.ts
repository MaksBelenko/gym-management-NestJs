import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GymClassesModule } from './End-Points/gym-classes/gym-classes.module';
import { TrainersModule } from './End-Points/trainers/trainers.module';
import { AuthModule } from './End-Points/auth/auth.module';
import { GymSessionsModule } from './End-Points/gym-sessions/gym-sessions.module';
import { typeOrmConfig } from './config/typeorm.config';
import { JoiValidationSchema } from './env-validation.schema';
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-rate-limiter';
import { rateLimiterConfig } from './config/rate-limiter.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: JoiValidationSchema,
            // isGlobal: true
        }),
        RateLimiterModule.register(rateLimiterConfig),
        TypeOrmModule.forRoot(typeOrmConfig),
        ScheduleModule.forRoot(),
        GymClassesModule, 
        TrainersModule, 
        GymSessionsModule, 
        AuthModule, 
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
    ],
})
export class AppModule {}
