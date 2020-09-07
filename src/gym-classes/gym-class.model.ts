import { GymClassStatus } from './gymclass-status.enum';

export interface GymClass {
    name: string;
    description: string;
    status: GymClassStatus;
    trainer: string;
    startDate: string;
    finishDate: string;
}
