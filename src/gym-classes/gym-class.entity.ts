import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GymSession } from '../gym-sessions/gym-session.entity';
import { PhotoGymClass } from './photo-gymclass.entity';

@Entity()
export class GymClass extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') //automatically generated and incremented
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    imageUrl?: string;

    @OneToMany(type => GymSession, session => session.gymClass, { eager: false })
    sessions: GymSession[];

    @OneToMany(type => PhotoGymClass, photo => photo.gymClass, { eager: true })
    photos: PhotoGymClass[];
}
