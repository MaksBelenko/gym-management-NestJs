import { IsOptional, MaxLength, Matches, IsString, IsEnum } from 'class-validator';
import { NameRegex } from '../../regex.constants';
import { TrainerType } from '../trainer-type.enum';
import { IDto } from '../../helpers/dto.interface';

export class UpdateTrainerDto implements IDto {
    
    @IsOptional()
    @MaxLength(30)
    @Matches(NameRegex, 
    { message: 'Forename should not contain any special characters, digits or new lines' })
    forename: string;

    @IsOptional()
    @MaxLength(30)
    @Matches(NameRegex, 
    { message: 'Surname should not contain any special characters, digits or new lines' })
    surname: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsEnum(TrainerType)
    type: TrainerType;
}