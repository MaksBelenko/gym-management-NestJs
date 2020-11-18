import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GymClassRepository } from './gym-class.repository';
import { PhotoGymClassRepository } from './photo-gymclass.repository';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { GetFilteredGymClassesDto } from './dto/get-filtered-gym-classes.dto';
import { GymClass } from './gym-class.entity';
import { ImageProcessingService } from '../Global-Modules/image-processing/image-processing.service';
import { AwsService } from '../Global-Modules/aws/aws.service';
import { PhotoGymClass } from './photo-gymclass.entity';

@Injectable()
export class GymClassesService {
    constructor(
        private awsService: AwsService,
        private imageProcessingService: ImageProcessingService,
        @InjectRepository(GymClassRepository)
        private gymClassRepository: GymClassRepository,
        @InjectRepository(PhotoGymClassRepository)
        private photoRepository: PhotoGymClassRepository,
    ) {}

    async getGymClasses(
        filterDto: GetFilteredGymClassesDto,
    ): Promise<GymClass[]> {
        return this.gymClassRepository.getGymClasses(filterDto);
    }

    async getGymClassById(id: string): Promise<GymClass> {
        const found = await this.gymClassRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(
                `Gym class with id = ${id} does not exist`,
            );
        }

        return found;
    }

    async createGymClass(createClassDto: CreateGymClassDto): Promise<GymClass> {
        return await this.gymClassRepository.createGymClass(createClassDto);
    }

    async deleteGymClassById(id: string): Promise<void> {
        const result = await this.gymClassRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Gym class with id ${id} not found`);
        }
    }

    async uploadImage(
        imageFile: Express.Multer.File,
        modelData: { name: string },
    ): Promise<PhotoGymClass> {

        if (imageFile) {
            const thumbBuffers = await this.imageProcessingService.resizeImage(
                imageFile,
            );

            const awsImageKeysDictionary = await this.awsService.uploadMultipleImages(
                modelData.name,
                thumbBuffers,
            );

            const photo = await this.photoRepository.saveAwsKeys(awsImageKeysDictionary);
            return photo;

        } else {
            throw new NotFoundException(`No image passed as a parameter`)
        }
    }

    async downloadImage() {
        return this.awsService.getPrivateFile();
    }
}
