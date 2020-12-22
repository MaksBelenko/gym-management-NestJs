import { BaseEntity, BeforeRemove, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GymSession } from '../gym-sessions/gym-session.entity';
import { Photo } from '../../Shared-Modules/photos/photo.entity';
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

    @OneToMany(type => GymSession, session => session.trainer)//, { eager: false })
    sessions: GymSession[];

    @BeforeRemove()
    async deleteParentSessions() {
        await Promise.all(
            this.sessions.map(async session => {
                await session.remove();
            }),
        );
    }
}
