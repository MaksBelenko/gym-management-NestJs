import { IsString, IsIn, IsNotEmpty, MinLength, IsOptional, IsEnum, Matches, Max, MaxLength } from 'class-validator';
import { TrainerType } from '../trainer-type.enum';

export class CreateTrainerDto {

    // @IsString()
    // @IsNotEmpty()
    // name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    forename: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    surname: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsEnum(TrainerType)
    type: TrainerType;
}