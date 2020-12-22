import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetTrainersFilterDto {
    
    @IsOptional()
    @IsNotEmpty()
    search: string;
}