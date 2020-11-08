import { IsDateString, IsIn, IsOptional } from "class-validator";
import { GymSessionStatus } from '../../gym-classes/gymsession-status.enum';

export class UpdateSessionDto {

    @IsOptional()
    newGymClassId: string;

    @IsOptional()
    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    finishDate: string;


    @IsOptional()
    @IsIn([GymSessionStatus.FULLY_BOOKED, GymSessionStatus.PLACES_AVAILABLE])
    status: GymSessionStatus;
}