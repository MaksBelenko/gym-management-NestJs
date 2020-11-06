import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';

@Module({
  controllers: [TrainersController],
  providers: [TrainersService]
})
export class TrainersModule {}
