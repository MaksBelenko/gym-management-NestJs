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
import { Dictionary } from 'lodash';

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

    /**
     * Gets all Gym classes matching dto
     * @param filterDto Filter DTO object
     */
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



    async createGymClass(
        createClassDto: CreateGymClassDto,
        imageFile: Express.Multer.File,
    ): Promise<GymClass> {
        let gymClass = await this.gymClassRepository.createGymClass(createClassDto);

        if (imageFile) {
            const awsKeysDict = await this.processAndUploadImage(imageFile, createClassDto.name);
            const photo = await this.photoRepository.saveAwsKeys(awsKeysDict, gymClass);

            gymClass = await this.gymClassRepository.findOne(gymClass.id);
        }

        return gymClass;
    }



    async deleteGymClassById(id: string): Promise<void> {
        const gymClassToDelete = await this.gymClassRepository.findOne(id);

        if (!gymClassToDelete) {
            throw new NotFoundException(`Gym class with id ${id} not found`);
        }

        const allImageNames = this.photoRepository.getAllImagesNames(gymClassToDelete.photos); 

        if (allImageNames) {
            await this.awsService.deleteMultipleImages(allImageNames);
            await this.photoRepository.deletePhotos(gymClassToDelete.photos);
        }

        await this.gymClassRepository.remove(gymClassToDelete);
    }



    async uploadAdditionalImage(
        id: string,
        imageFile: Express.Multer.File,
    ): Promise<PhotoGymClass> {

        const gymClass = await this.gymClassRepository.findOne(id)

        if (imageFile && gymClass) {
            const awsImageKeysDictionary = await this.processAndUploadImage(imageFile, gymClass.name);
            const photo = await this.photoRepository.saveAwsKeys(
                awsImageKeysDictionary,
                gymClass,
            );

            delete photo.gymClass;

            return photo;
        }

        throw new NotFoundException(`No image passed as a parameter`);
    }



    async downloadImage(name: string) {
        return this.awsService.downloadImage(name);
    }

    /**
     * Resizes an image and uploads it to AWS S3 with thumbnails
     * @param imageFile file to resize and upload to aws S3
     * @param name name of the file
     */
    private async processAndUploadImage(
        imageFile: Express.Multer.File,
        name: string,
    ): Promise<Dictionary<string>> {
        const thumbBuffers = await this.imageProcessingService.resizeImage(
            imageFile,
        );

        return this.awsService.uploadMultipleImages(name,thumbBuffers);
    }
}
