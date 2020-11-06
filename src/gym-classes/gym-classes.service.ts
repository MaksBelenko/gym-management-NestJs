import { Injectable } from '@nestjs/common';
import { GymClass } from '../Models/gym-class.model';
import { GymSessionStatus } from './gymclass-status.enum';
import { UtcDateObject } from '../shared/date-object.model';

@Injectable()
export class GymClassesService {
    private gymClasses: GymClass[] = [
        {
            id: '123',
            name: 'test name',
            description: 'test description',
            imageUrl: 'http://test123.com'
        },
        {
            id: '111',
            name: '111 name',
            description: 'test description 111',
            // startDate: new UtcDateObject().toIsoString(),
            // finishDate: new UtcDateObject().toIsoString(),
        },
    ];

    getAllGymClasses(): GymClass[] {
        return this.gymClasses;
    }
}
