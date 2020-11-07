import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
    @IsNotEmpty()
    gymClassId: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    finishDate: string;
}
