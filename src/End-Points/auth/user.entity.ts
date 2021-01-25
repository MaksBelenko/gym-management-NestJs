import { type } from 'os';
import { LocalAuthToken } from 'src/Shared-Modules/token-storage/local-auth-token.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from './RBAC/role.enum';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    fullName: string;

    @Column({ default: Role.User })
    role: Role;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    confirmed: boolean;

    @Column({ default: 0 })
    confirmationTries: number;

    @OneToMany(type => LocalAuthToken, token => token.user, { eager: false })
    tokens: LocalAuthToken[];

    @CreateDateColumn()
    createdAt: Date;
}