import { Module } from '@nestjs/common';
import { GymClassesModule } from './gym-classes/gym-classes.module';

@Module({
  imports: [GymClassesModule],
})
export class AppModule {}
