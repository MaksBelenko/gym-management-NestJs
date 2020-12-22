import { Module } from '@nestjs/common';
import { GymSessionsController } from './gym-sessions.controller';
import { GymSessionsService } from './gym-sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymSessionRepository } from './gym-session.repository';
import { GymClassRepository } from '../gym-classes/gym-class.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GymSessionRepository,
      GymClassRepository
    ]),
  ],
  controllers: [GymSessionsController],
  providers: [GymSessionsService]
})
export class GymSessionsModule {}
