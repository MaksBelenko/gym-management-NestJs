import { IsDateString, IsOptional } from "class-validator";

export class GetSessionsFilterDto {

    @IsOptional()
    @IsDateString()
    start: string;

    @IsOptional()
    @IsDateString()
    end: string;
}