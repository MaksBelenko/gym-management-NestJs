import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateSessionDto {

    @IsOptional()
    @IsString()
    newGymClassId: string;

    @IsOptional()
    @IsDateString()
    startDate: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    durationMins: number;


    // @IsOptional()
    // @IsEnum(GymSessionStatus)
    // // @IsIn([GymSessionStatus.FULLY_BOOKED, GymSessionStatus.PLACES_AVAILABLE])
    // status: GymSessionStatus;
}