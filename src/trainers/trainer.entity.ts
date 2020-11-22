import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { GymSession } from '../gym-sessions/gym-session.entity';
import { Photo } from '../Global-Modules/photos/photo.entity';
import { TrainerType } from './trainer-type.enum';

@Entity()
export class Trainer extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') //automatically generated and incremented
    id: string;

    // @Column({ unique: true })
    // name: string;

    @Column()
    forename: string;

    @Column()
    surname: string;

    @Column()
    description: string;

    @Column()
    type: TrainerType;

    @ManyToMany(type => Photo) // , { cascade: true })
    @JoinTable()
    photos: Photo[];

    @OneToMany(type => GymSession, gymSession => gymSession.trainer)//, { eager: false })
    gymSessions: GymSession[];
}
