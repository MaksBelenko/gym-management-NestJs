import { Module } from '@nestjs/common';
import { GymSessionsController } from './gym-sessions.controller';
import { GymSessionsService } from './gym-sessions.service';

@Module({
  controllers: [GymSessionsController],
  providers: [GymSessionsService]
})
export class GymSessionsModule {}
