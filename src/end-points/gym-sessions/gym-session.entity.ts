import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Trainer } from '../trainers/trainer.entity';
import { GymClass } from '../gym-classes/gym-class.entity';

@Entity()
export class GymSession extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') //automatically generated and incremented
    id: string;

    @Column()
    maxNumberOfPlaces: number;

    @Column({ default: 0})
    bookedPlaces: number;

    @Column()
    startDate: Date;
    
    @Column()
    durationMins: number;

    @ManyToOne(type => GymClass, gymClass => gymClass.sessions)//, { eager: true })
    gymClass: GymClass;

    @ManyToOne(type => Trainer, trainer => trainer.sessions)//, { eager: true })
    trainer: Trainer;
}
