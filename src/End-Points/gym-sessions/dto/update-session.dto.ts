import { IsDateString, IsEnum, IsIn, IsOptional, IsString } from "class-validator";
import { GymSessionStatus } from '../gymsession-status.enum';

export class UpdateSessionDto {

    @IsOptional()
    @IsString()
    newGymClassId: string;

    @IsOptional()
    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    finishDate: string;


    @IsOptional()
    @IsEnum(GymSessionStatus)
    // @IsIn([GymSessionStatus.FULLY_BOOKED, GymSessionStatus.PLACES_AVAILABLE])
    status: GymSessionStatus;
}