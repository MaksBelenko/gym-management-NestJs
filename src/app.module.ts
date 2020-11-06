import { Module } from '@nestjs/common';
import { GymClassesModule } from './gym-classes/gym-classes.module';
import { TrainersModule } from './trainers/trainers.module';
import { GymSessionsModule } from './gym-sessions/gym-sessions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        GymClassesModule, 
        TrainersModule, 
        GymSessionsModule],
})
export class AppModule {}
