import { Module } from '@nestjs/common';
import { GymClassesService } from './gym-classes.service';
import { GymClassesController } from './gym-classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClassRepository } from './gym-class.repository';
import { PhotoGymClassRepository } from './photo-gymclass.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([GymClassRepository, PhotoGymClassRepository]),
    ],
    providers: [GymClassesService],
    controllers: [GymClassesController],
})
export class GymClassesModule {}
