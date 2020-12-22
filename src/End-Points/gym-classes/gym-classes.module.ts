import { Module } from '@nestjs/common';
import { GymClassesService } from './gym-classes.service';
import { GymClassesController } from './gym-classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClassRepository } from './gym-class.repository';
import { PhotosModule } from 'src/Shared-Modules/photos/photos.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([GymClassRepository]),
        PhotosModule,
    ],
    providers: [GymClassesService],
    controllers: [GymClassesController],
})
export class GymClassesModule {}
