import { User } from '../../End-Points/auth/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { JwtType } from '../../shared/jwt-type.enum';

@Entity()
export class LocalAuthToken extends BaseEntity {
    // @PrimaryGeneratedColumn() //automatically generated and incremented
    // id: string;

    @PrimaryColumn()
    token: string;

    @Column({ type: 'enum', enum: JwtType})
    tokenType: JwtType;

    @OneToOne(type => LocalAuthToken, token => token.token)
    referenceToken: string;

    @CreateDateColumn()
    creationDate: Date;

    @ManyToOne(type => User, user => user.tokens, { eager: true })
    user: User;
}
