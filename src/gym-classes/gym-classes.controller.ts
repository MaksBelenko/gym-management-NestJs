import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
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
    createGymClass(
        @Body() createClassDto: CreateGymClassDto,
    ): Promise<GymClass> {
        return this.gymClassesService.createGymClass(createClassDto);
    }

    @Delete('/:id')
    async deleteGymClassById(@Param('id') id: string): Promise<void> {
        return this.gymClassesService.deleteGymClassById(id);
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('image', imageMulterOptions))
    async uploadModel(
        @UploadedFile() imageFile: Express.Multer.File,
        @Body() modelData: { name: string; image: any },
    ): Promise<void> {
        return this.gymClassesService.uploadImage(imageFile, modelData);
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
