import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotosService } from '../../Shared-Modules/photos/photos.service';
import { TrainerRepository } from './trainer.repository';
import { GetTrainersFilterDto } from './dto/get-trainers-filter.dto';
import { Trainer } from './trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Photo } from '../../Shared-Modules/photos/photo.entity';

@Injectable()
export class TrainersService {
    constructor(
        private photoService: PhotosService,
        @InjectRepository(TrainerRepository)
        private trainerRepository: TrainerRepository,
    ) {}


    async getTrainers(filterDto: GetTrainersFilterDto): Promise<Trainer[]> {
        return this.trainerRepository.getTrainers(filterDto);
    }


    async getTrainerById(id: string): Promise<Trainer> {
        return this.trainerRepository.getTrainerById(id);
    }


    async createTrainer(createTrainerDto: CreateTrainerDto): Promise<Trainer> {
        return this.trainerRepository.createTrainer(createTrainerDto);
    }


    async deleteTrainerById(id: string): Promise<void> {
        const gymClassToDelete = await this.trainerRepository.getTrainerById(id, true);

        if (!gymClassToDelete) {
            throw new NotFoundException(`Gym class with id ${id} not found`);
        }
        
        await this.photoService.deletePhotos(gymClassToDelete.photos);
        await this.trainerRepository.remove(gymClassToDelete);
    }


    async updateTrainer(id: string, updateDto: UpdateTrainerDto): Promise<Trainer> {
        return this.trainerRepository.updateTrainer(id, updateDto);
    }


    async uploadAdditionalImage(
        id: string,
        imageFile: Express.Multer.File,
    ): Promise<Photo> {

        if (!imageFile) {
            throw new BadRequestException(`No image passed as a parameter`);
        }

        const trainer = await this.trainerRepository.getTrainerById(id);//findOne(id)

        if (!trainer) {
            throw new NotFoundException(`Gym class with id ${id} not found`);
        }

        const name = trainer.forename + '_' + trainer.surname;
        const photo = await this.photoService.generatePhoto(name, imageFile);

        trainer.photos.push(photo);
        await trainer.save();

        return photo;   
    }


    async deletePhoto(imageId: string): Promise<void> {
        await this.photoService.deletePhotoById(imageId);
    }
}
