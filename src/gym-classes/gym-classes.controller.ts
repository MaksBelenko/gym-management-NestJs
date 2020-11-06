import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { GymClassesService } from './gym-classes.service';
import { GymClass } from '../Models/gym-class.model';
import { CreateGymClassDto } from '../DTOs/create-gym-class.dro';
import { GetFilteredGymClassesDto } from '../DTOs/get-filtered-gym-classes.dto';

@Controller('gym-classes')
export class GymClassesController {
    constructor(private gymClassesService: GymClassesService) {}

    @Get()
    getClasses(@Query(ValidationPipe) filterDto: GetFilteredGymClassesDto): GymClass[] {
        if (Object.keys(filterDto).length) {
            return this.gymClassesService.getTasksWithFilters(filterDto);
        } else {
            return this.gymClassesService.getAllGymClasses();
        }
    }

    @Get('/:id')
    getGymClassById(@Param('id') id: string): GymClass {
        return this.gymClassesService.getGymClassById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createGymClass(@Body() createClassDto: CreateGymClassDto): GymClass {
        return this.gymClassesService.createGymClass(createClassDto);
    }

    @Delete('/:id')
    deleteGymClassById(@Param('id') id: string): GymClass {
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
