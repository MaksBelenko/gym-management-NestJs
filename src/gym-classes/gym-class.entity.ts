import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GymClass extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') //automatically generated and incremented
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    imageUrl?: string;
}
