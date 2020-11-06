import { GymClassStatus } from './gymclass-status.enum';

export class GymClass {
    id: string;
    name: string;
    description: string;
    status: GymClassStatus;
    trainer: string;
    startDate: string;
    finishDate: string;
}
