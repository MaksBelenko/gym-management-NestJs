import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GymSession } from '../gym-sessions/gym-session.entity';

@Entity()
export class Trainer extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') //automatically generated and incremented
    id: string;

    @Column()
    name: string;
    
    @Column()
    description: string;

    // @OneToMany(type => GymSession, gymSession => gymSession.trainer, { eager: false })
    // gymSessions: GymSession[];
    
    // photoUrl: string;
}
