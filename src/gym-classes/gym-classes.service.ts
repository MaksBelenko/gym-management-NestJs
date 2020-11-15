import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { GetFilteredGymClassesDto } from './dto/get-filtered-gym-classes.dto';
import { GymClassRepository } from './gym-class.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GymClass } from './gym-class.entity';
import { ImageProcessingService } from '../Global-Modules/image-processing/image-processing.service';
import Size from '../models/size.type';

@Injectable()
export class GymClassesService {
    
    constructor(
        private imageProcessingService: ImageProcessingService,
        @InjectRepository(GymClassRepository)
        private gymClassRepository: GymClassRepository,
    ) {}

    async getGymClasses(filterDto: GetFilteredGymClassesDto): Promise<GymClass[]> {
        return this.gymClassRepository.getGymClasses(filterDto);
    }

    async getGymClassById(id: string): Promise<GymClass> {
        const found = await this.gymClassRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Gym class with id = ${id} does not exist`);
        }

        return found;
    }

    async createGymClass(createClassDto: CreateGymClassDto): Promise<GymClass> {
        return await this.gymClassRepository.createGymClass(createClassDto);
    }

    async deleteGymClassById(id: string): Promise<void> {
        const result = await this.gymClassRepository.delete(id);

        if (result.affected === 0){
            throw new NotFoundException(`Gym class with id ${id} not found`)
        }
    }

    async uploadImage(file: Express.Multer.File, modelData: { name: string; image: any }): Promise<void> {
        console.log(modelData);

        var newBuffer = await this.imageProcessingService.resizeImage(file, [new Size(100, 100), new Size(200, 200)]);
        console.log(newBuffer);
    }
}
