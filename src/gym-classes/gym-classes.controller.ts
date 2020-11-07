import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { GymClassesService } from './gym-classes.service';
import { CreateGymClassDto } from './dto/create-gym-class.dro';
import { GetFilteredGymClassesDto } from './dto/get-filtered-gym-classes.dto';
import { GymClass } from './gym-class.entity';
import { TransformInterceptor } from '../Interceptors/transform.interceptor';

@Controller('gym-classes')
@UseInterceptors(TransformInterceptor)
export class GymClassesController {
    constructor(private gymClassesService: GymClassesService) {}

    @Get()
    getClasses(@Query(ValidationPipe) filterDto: GetFilteredGymClassesDto): Promise<GymClass[]> {
        return this.gymClassesService.getGymClasses(filterDto);
    }

    @Get('/:id')
    getGymClassById(@Param('id') id: string): Promise<GymClass> {
        return this.gymClassesService.getGymClassById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createGymClass(@Body() createClassDto: CreateGymClassDto): Promise<GymClass> {
        return this.gymClassesService.createGymClass(createClassDto);
    }

    @Delete('/:id')
    async deleteGymClassById(@Param('id') id: string): Promise<void> {
        return this.gymClassesService.deleteGymClassById(id);
    }

    // @Patch('/:id/status')
    // changeGymClass(
    //     @Param('id') id: string,
    //     @Body('status') status: GymSessionStatus,
    // ) {

    // }

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
