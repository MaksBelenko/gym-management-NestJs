import { User } from '../../End-Points/auth/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LocalAuthToken extends BaseEntity {
    @PrimaryGeneratedColumn() //automatically generated and incremented
    id: string;

    @Column()
    token: string;

    @CreateDateColumn()
    creationDate: Date;

    @ManyToOne(type => User, user => user.tokens, { eager: true })
    user: User;
}
