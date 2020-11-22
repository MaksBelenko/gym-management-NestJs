import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { GetFilteredGymClassesDto } from './dto/get-filtered-gym-classes.dto';
import { GymClass } from './gym-class.entity';
import { Photo } from '../Global-Modules/photos/photo.entity';
import { PhotosService } from '../Global-Modules/photos/photos.service';
import { InjectRepository } from '@nestjs/typeorm';
import { GymClassRepository } from './gym-class.repository';

@Injectable()
export class GymClassesService {
    
    constructor(
        private photoService: PhotosService,
        @InjectRepository(GymClassRepository)
        private gymClassRepository: GymClassRepository,
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
        const found = await this.gymClassRepository.getGymClassById(id);

        if (!found) {
            throw new NotFoundException(`Gym class with id = ${id} does not exist`);
        }

        return found;
    }



    async createGymClass(
        createClassDto: CreateGymClassDto,
    ): Promise<GymClass> {
        return this.gymClassRepository.createGymClass(createClassDto);
    }



    async deleteGymClassById(id: string): Promise<void> {
        const gymClassToDelete = await this.gymClassRepository.getGymClassById(id, true);

        if (!gymClassToDelete) {
            throw new NotFoundException(`Gym class with id ${id} not found`);
        }
        
        await this.photoService.deletePhotos(gymClassToDelete.photos);
        await this.gymClassRepository.remove(gymClassToDelete);
    }



    async uploadAdditionalImage(
        id: string,
        imageFile: Express.Multer.File,
    ): Promise<Photo> {

        if (!imageFile) {
            throw new BadRequestException(`No image passed as a parameter`);
        }

        const gymClass = await this.gymClassRepository.getGymClassById(id);//findOne(id)

        if (!gymClass) {
            throw new NotFoundException(`Gym class with id ${id} not found`);
        }

        const photo = await this.photoService.generatePhoto(gymClass.name, imageFile);

        gymClass.photos.push(photo);
        await gymClass.save();

        return photo;
        
    }


    async downloadImage(name: string) {
        return this.photoService.downloadImage(name);
    }
}
