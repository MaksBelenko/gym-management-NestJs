import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateSessionDto {
    @IsNotEmpty()
    gymClassId: string;

    @IsNotEmpty()
    trainerId: string;

    @IsDateString()
    startDate: string;

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    durationMins: number;
}
