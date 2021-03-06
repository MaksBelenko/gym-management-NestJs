import { Controller, Get, Param, ParseUUIDPipe, Post, Query, ValidationPipe, Body, Delete, Patch, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { GetTrainersFilterDto } from './dto/get-trainers-filter.dto';
import { Trainer } from './trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageMulterOptions } from '../../shared/image-file.filter';
import { Photo } from '../../Shared-Modules/photos/photo.entity';
import { Response } from 'express';

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

    @Delete('/:id')
    async deleteTrainerById(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<void> {
        return this.trainerService.deleteTrainerById(id);
    }

    @Patch('/:id')
    async updateTrainer(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(ValidationPipe) updateDto: UpdateTrainerDto,
    ): Promise<Trainer> {
        return this.trainerService.updateTrainer(id, updateDto);
    }

    @Post('/image/upload/:id')
    @UseInterceptors(FileInterceptor('image', imageMulterOptions))
    async uploadModel(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFile() imageFile: Express.Multer.File,
    ): Promise<Photo> {
        return this.trainerService.uploadAdditionalImage(id, imageFile);
    }

    @Get('/image/download/:name')
    async getPrivateFile(
        @Param('name') name: string,
        @Res() res: Response,
    ) {
        const file = await this.trainerService.downloadImage(name);
        file.stream.pipe(res);
    }


    @Delete('/image/delete/:id')
    async deleteImage(
        @Param('id', ParseUUIDPipe) imageId: string,
    ): Promise<void> {
        return this.trainerService.deletePhoto(imageId);
    }
}
