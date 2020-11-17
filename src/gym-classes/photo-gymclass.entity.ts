import { IsString } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PhotoGymClass extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') //automatically generated and incremented
    id: string;

    @IsString()
    @Column()
    smallImageKey: string;

    @IsString()
    @Column()
    mediumImageKey: string;

    @IsString()
    @Column()
    largeImageKey: string;
}