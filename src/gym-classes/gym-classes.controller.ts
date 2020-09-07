import { Controller, Get, Res } from '@nestjs/common';
import { GymClassesService } from './gym-classes.service';
import { GymClass } from './gym-class.model';

@Controller('gym-classes')
export class GymClassesController {

    constructor(
        private gymClassesService: GymClassesService
    ) {}


    @Get()
    getAllClasses(): GymClass[] {
        return this.gymClassesService.getAllGymClasses();
    }


    @Get('download')
    download(@Res() res) {
        const fileName = `${__dirname}\images\test-image.png`;
        return res.dowload(fileName);
    }
}
