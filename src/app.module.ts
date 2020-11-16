import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClassesModule } from './gym-classes/gym-classes.module';
import { TrainersModule } from './trainers/trainers.module';
import { GymSessionsModule } from './gym-sessions/gym-sessions.module';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ImageProcessingModule } from './Global-Modules/image-processing/image-processing.module';
import { AwsModule } from './Global-Modules/aws/aws.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        GymClassesModule, 
        TrainersModule, 
        GymSessionsModule, 
        AuthModule,
        ImageProcessingModule,
        AwsModule,
    ],
})
export class AppModule {}
