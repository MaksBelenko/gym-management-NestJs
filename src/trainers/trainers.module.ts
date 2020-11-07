import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerRepository } from './trainer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainerRepository]),
  ],
  controllers: [TrainersController],
  providers: [TrainersService]
})
export class TrainersModule {}
