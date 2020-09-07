import { Injectable } from '@nestjs/common';
import { GymClass } from './gym-class.model';
import { GymClassStatus } from './gymclass-status.enum';
import { UtcDateObject } from '../shared/date-object.model';

@Injectable()
export class GymClassesService {
    private gymClasses: GymClass[] = [
        {
            name: 'test name',
            description: 'test description',
            status: GymClassStatus.PLACES_AVAILABLE,
            trainer: 'Belenko M.',
            startDate: new UtcDateObject().toIsoString(),
            finishDate: new UtcDateObject().toIsoString(),
        },
    ];

    getAllGymClasses(): GymClass[] {
        return this.gymClasses;
    }
}
