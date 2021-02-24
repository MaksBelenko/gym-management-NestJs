import { Module } from '@nestjs/common';
import { GymSessionsController } from './gym-sessions.controller';
import { GymSessionsService } from './gym-sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymSessionRepository } from './gym-session.repository';
import { GymClassRepository } from '../gym-classes/gym-class.repository';
import { TrainerRepository } from '../trainers/trainer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GymSessionRepository,
      GymClassRepository,
      TrainerRepository,
    ]),
  ],
  controllers: [GymSessionsController],
  providers: [GymSessionsService]
})
export class GymSessionsModule {}
