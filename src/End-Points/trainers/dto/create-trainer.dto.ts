import { IsString, IsNotEmpty, IsOptional, IsEnum, Matches, MaxLength } from 'class-validator';
import { TrainerType } from '../trainer-type.enum';
import { NameRegex } from '../../../shared/regex.constants';


export class CreateTrainerDto {

    // @IsString()
    // @IsNotEmpty()
    // name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @Matches(NameRegex, 
    { message: 'Forename should not contain any special characters, digits or new lines' })
    forename: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @Matches(NameRegex, 
    { message: 'Surname should not contain any special characters or digits or new lines' })
    surname: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsEnum(TrainerType)
    type: TrainerType;
}