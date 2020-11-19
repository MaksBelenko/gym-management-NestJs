import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Trainer } from '../trainers/trainer.entity';
import { GymSessionStatus } from '../gym-classes/gymsession-status.enum';
import { GymClass } from '../gym-classes/gym-class.entity';

@Entity()
export class GymSession extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') //automatically generated and incremented
    id: string;

    @Column()
    status: GymSessionStatus;

    @ManyToOne(
        type => GymClass,
        gymClass => gymClass.sessions,
        { eager: true },
    )
    gymClass: GymClass;

    // @ManyToOne(type => Trainer, trainer => trainer.gymSessions, { eager: true })
    // trainer: Trainer;

    @Column()
    startDate: Date;

    @Column()
    finishDate: Date;
}
