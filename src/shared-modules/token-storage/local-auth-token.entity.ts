import { User } from '../../end-points/auth/user.entity';
import {
    BaseEntity,
    BeforeRemove,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthTokenType } from './auth-token.enum';
import { ManyToMany } from 'typeorm';

@Entity()
export class LocalAuthToken extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') //automatically generated and incremented
    token: string;

    // @PrimaryColumn()
    // token: string;

    @Column({ type: 'enum', enum: AuthTokenType})
    tokenType: AuthTokenType;

    @Column({ nullable: true})
    public relatedReferenceTokenId?: string;


    @ManyToOne(
        type => LocalAuthToken, 
        tokenEntity =>  tokenEntity.token, 
        { onDelete: 'SET NULL' } 
    )
    @JoinColumn({ name: 'relatedReferenceTokenId' })
    referenceToken: LocalAuthToken;

    @CreateDateColumn()
    creationDate: Date;

    @ManyToOne(type => User, user => user.tokens, { eager: true })
    user: User;
}
