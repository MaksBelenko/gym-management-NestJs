import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GymClassesModule } from './gym-classes/gym-classes.module';

@Module({
  imports: [GymClassesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
