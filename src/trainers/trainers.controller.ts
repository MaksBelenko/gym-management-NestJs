import { Controller, Get, Param, ParseUUIDPipe, Post, Query, ValidationPipe, Body, Delete, Patch } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { GetTrainersFilterDto } from './dto/get-trainers-filter.dto';
import { Trainer } from './trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

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
        @Body(ValidationPipe) updateDto: UpdateTrainerDto
    ): Promise<Trainer> {
        return this.trainerService.updateTrainer(id, updateDto);
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
