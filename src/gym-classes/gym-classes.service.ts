import { Injectable } from '@nestjs/common';
import { GymClass } from './gym-class.model';
import { GymClassStatus } from './gymclass-status.enum';
import { UtcDateObject } from '../shared/date-object.model';

@Injectable()
export class GymClassesService {
    private gymClasses: GymClass[] = [
        {
            id: '123',
            name: 'test name',
            description: 'test description',
            status: GymClassStatus.PLACES_AVAILABLE,
            trainer: 'Belenko M.',
            startDate: new UtcDateObject().toIsoString(),
            finishDate: new UtcDateObject().toIsoString(),
        },

        {
            id: '111',
            name: '111 name',
            description: 'test description 111',
            status: GymClassStatus.FULLY_BOOKED,
            trainer: 'Belenko M.',
            startDate: new UtcDateObject().toIsoString(),
            finishDate: new UtcDateObject().toIsoString(),
        },
    ];

    getAllGymClasses(): GymClass[] {
        return this.gymClasses;
    }
}
