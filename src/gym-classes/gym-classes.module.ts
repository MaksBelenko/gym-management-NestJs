import { Module } from '@nestjs/common';
import { GymClassesService } from './gym-classes.service';
import { GymClassesController } from './gym-classes.controller';

@Module({
  providers: [GymClassesService],
  controllers: [GymClassesController]
})
export class GymClassesModule {}
