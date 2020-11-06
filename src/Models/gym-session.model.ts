import { Trainer } from './trainer.model';
import { GymClass } from './gym-class.model';
import { GymSessionStatus } from '../gym-classes/gymclass-status.enum';

export class GymSession {
    id: string;
    name: string;
    description: string;
    status: GymSessionStatus;
    gymClass: GymClass;
    trainer: Trainer;
    startDate: string;
    finishDate: string;
}
