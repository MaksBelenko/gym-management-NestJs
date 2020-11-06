import { Trainer } from './trainer.model';
import { GymSessionStatus } from '../gym-classes/gymsession-status.enum';

export class GymSession {
    id: string;
    name: string;
    description: string;
    status: GymSessionStatus;
    // gymClass: GymClass;
    trainer: Trainer;
    startDate: string;
    finishDate: string;
}
