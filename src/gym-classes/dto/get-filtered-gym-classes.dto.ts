import { IsNotEmpty, IsOptional } from "class-validator";

export class GetFilteredGymClassesDto {
    @IsOptional()
    @IsNotEmpty()
    search: string;
};
