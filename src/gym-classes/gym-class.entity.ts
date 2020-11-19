import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GymSession } from '../gym-sessions/gym-session.entity';
import { Photo } from '../Global-Modules/photos/photo.entity';

@Entity()
export class GymClass extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') //automatically generated and incremented
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(type => GymSession, session => session.gymClass, { eager: false })
    sessions: GymSession[];

    @ManyToMany(type => Photo)// , { cascade: true })
    @JoinTable()
    photos: Photo[];
}
