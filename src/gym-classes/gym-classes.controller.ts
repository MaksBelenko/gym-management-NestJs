import { Controller, Get } from '@nestjs/common';
import { GymClassesService } from './gym-classes.service';
import { GymClass } from './gym-class.model';

@Controller('gym-classes')
export class GymClassesController {

    constructor(private gymClassesService: GymClassesService) {}


    @Get()
    getAllClasses(): GymClass[] {
        return this.gymClassesService.getAllGymClasses();
    }
}
