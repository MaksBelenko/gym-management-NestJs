import { Module } from '@nestjs/common';
import { GymClassesModule } from './gym-classes/gym-classes.module';
import { TrainersModule } from './trainers/trainers.module';
import { GymSessionsModule } from './gym-sessions/gym-sessions.module';

@Module({
  imports: [GymClassesModule, TrainersModule, GymSessionsModule],
})
export class AppModule {}
