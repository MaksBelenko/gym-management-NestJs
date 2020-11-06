import { Controller, Get, Res } from '@nestjs/common';
import { GymClassesService } from './gym-classes.service';
import { GymClass } from './gym-class.model';

@Controller('gym-classes')
export class GymClassesController {
    
    constructor(private gymClassesService: GymClassesService) {}

    @Get()
    getAllClasses(): GymClass[] {
        return this.gymClassesService.getAllGymClasses();
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
