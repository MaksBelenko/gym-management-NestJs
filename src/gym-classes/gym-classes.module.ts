import { Module } from '@nestjs/common';
import { GymClassesService } from './gym-classes.service';
import { GymClassesController } from './gym-classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClassRepository } from './gym-class.repository';
import { PhotoRepository } from './photo.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([GymClassRepository, PhotoRepository]),
    ],
    providers: [GymClassesService],
    controllers: [GymClassesController],
})
export class GymClassesModule {}
