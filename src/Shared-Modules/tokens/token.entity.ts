import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
// @Unique(['email'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    refreshToken: string;

    // @Exclude()

}