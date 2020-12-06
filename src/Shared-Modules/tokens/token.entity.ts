import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
// @Unique(['email'])
export class JwtTokens extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    refreshToken: string;

    // @Column()
    // accessToken: string;

    @Column()
    expiresAt: number;  // epoch time
}