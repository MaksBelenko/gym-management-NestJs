import { Module } from '@nestjs/common';
import { GymClassesModule } from './gym-classes/gym-classes.module';
import { TrainersModule } from './trainers/trainers.module';
import { GymSessionsModule } from './gym-sessions/gym-sessions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ImageProcessingModule } from './Global-Modules/image-processing/image-processing.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        GymClassesModule, 
        TrainersModule, 
        GymSessionsModule, 
        AuthModule,
        ImageProcessingModule,
    ],
})
export class AppModule {}
