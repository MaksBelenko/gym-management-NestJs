import { Controller, Get, Param, ParseUUIDPipe, Post, Query, UploadedFile, UseInterceptors, ValidationPipe, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Photo } from '../Global-Modules/photos/photo.entity';
import { imageMulterOptions } from '../shared/image-file.filter';
import { TrainersService } from './trainers.service';
import { GetTrainersFilterDto } from './dto/get-trainers-filter.dto';
import { Trainer } from './trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';

@Controller('trainers')
export class TrainersController {
    
    constructor(
        private trainerService: TrainersService,
    ) {}

    @Get()
    getClasses(
        @Query(ValidationPipe) filterDto: GetTrainersFilterDto,
    ): Promise<Trainer[]> {
        return this.trainerService.getTrainers(filterDto);
    }

    @Get('/:id')
    getTrainerById(@Param('id', ParseUUIDPipe) id: string): Promise<Trainer> {
        return this.trainerService.getTrainerById(id);
    }

    @Post()
    createGymClass(
        @Body(ValidationPipe) createTrainerDto: CreateTrainerDto,
    ): Promise<Trainer> {
        return this.trainerService.createTrainer(createTrainerDto);
    }

    // @Post('/image/upload/:id')
    // @UseInterceptors(FileInterceptor('image', imageMulterOptions))
    // async uploadModel(
    //     @Param('id', ParseUUIDPipe) id: string,
    //     @UploadedFile() imageFile: Express.Multer.File,
    // ): Promise<Photo> {
    //     return this.gymClassesService.uploadAdditionalImage(id, imageFile);
    // }
}
