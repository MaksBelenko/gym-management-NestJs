import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotosService } from '../Global-Modules/photos/photos.service';
import { TrainerRepository } from './trainer.repository';
import { GetTrainersFilterDto } from './dto/get-trainers-filter.dto';
import { Trainer } from './trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';

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
}
