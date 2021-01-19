import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
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

    @Column({ default: new Date() })
    initialRegisterTryTime: Date;
}