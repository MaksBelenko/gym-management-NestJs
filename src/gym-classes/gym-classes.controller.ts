import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
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
import { PhotoGymClass } from './photo-gymclass.entity';

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
    getGymClassById(@Param('id') id: string): Promise<GymClass> {
        return this.gymClassesService.getGymClassById(id);
    }


    @Post()
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('image', imageMulterOptions))
    createGymClass(
        @UploadedFile() imageFile: Express.Multer.File,
        @Body() createClassDto: CreateGymClassDto,
    ): Promise<GymClass> {
        return this.gymClassesService.createGymClass(createClassDto, imageFile);
    }


    @Delete('/:id')
    async deleteGymClassById(@Param('id') id: string): Promise<void> {
        return this.gymClassesService.deleteGymClassById(id);
    }


    @Post('/image-upload/:id')
    @UseInterceptors(FileInterceptor('image', imageMulterOptions))
    async uploadModel(
        @Param('id') id: string,
        @UploadedFile() imageFile: Express.Multer.File,
    ): Promise<PhotoGymClass> {
        return this.gymClassesService.uploadAdditionalImage(id, imageFile);
    }


    @Get('/image/:name')
    async getPrivateFile(
        @Param('name') name: string,
        @Res() res: Response,
    ) {
        const file = await this.gymClassesService.downloadImage(name);
        file.stream.pipe(res);
    }

    // @Get('download')
    // download(@Res() res) {
    //     const fileName = this.removeDistFrom(__dirname) + '/images/test-image.png'
    //     return res.sendFile(fileName);
    // }

    // private removeDistFrom(path: string): string {
    //     const lastIndex = path.lastIndexOf('/dist');
    //     return path.substring(0, lastIndex);
    // }
}
