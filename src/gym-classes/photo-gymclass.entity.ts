import { IsString } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { GymClass } from './gym-class.entity';

@Entity()
export class PhotoGymClass extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') //automatically generated and incremented
    id: string;

    @IsString()
    @Column()
    small: string;

    @IsString()
    @Column()
    medium: string;

    @IsString()
    @Column()
    large: string;

    @ManyToOne(type => GymClass, gymClass => gymClass.photos, { eager: false })
    gymClass: GymClass;
}