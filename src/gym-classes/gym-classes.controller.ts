import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GymClassesService } from './gym-classes.service';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { GetFilteredGymClassesDto } from './dto/get-filtered-gym-classes.dto';
import { GymClass } from './gym-class.entity';
import { TransformInterceptor } from '../Interceptors/transform.interceptor';
import { imageMulterOptions } from '../shared/image-file.filter';
import { Response } from 'express';
import { Photo } from './photo.entity';

@Controller('gym-classes')
@UseInterceptors(TransformInterceptor)
export class GymClassesController {
    constructor(private gymClassesService: GymClassesService) {}

    @Get()
    getClasses(
        @Query(ValidationPipe) filterDto: GetFilteredGymClassesDto,
    ): Promise<GymClass[]> {
        return this.gymClassesService.getGymClasses(filterDto);
    }


    @Get('/:id')
    getGymClassById(@Param('id', ParseUUIDPipe) id: string): Promise<GymClass> {
        return this.gymClassesService.getGymClassById(id);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createGymClass(
        @Body() createClassDto: CreateGymClassDto,
    ): Promise<GymClass> {
        return this.gymClassesService.createGymClass(createClassDto);
    }


    @Delete('/:id')
    async deleteGymClassById(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.gymClassesService.deleteGymClassById(id);
    }


    @Post('/image/upload/:id')
    @UseInterceptors(FileInterceptor('image', imageMulterOptions))
    async uploadModel(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFile() imageFile: Express.Multer.File,
    ): Promise<Photo> {
        return this.gymClassesService.uploadAdditionalImage(id, imageFile);
    }


    @Get('/image/download/:name')
    async getPrivateFile(
        @Param('name') name: string,
        @Res() res: Response,
    ) {
        const file = await this.gymClassesService.downloadImage(name);
        file.stream.pipe(res);
    }
}
