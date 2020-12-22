import { IsNotEmpty } from "class-validator";

export class CreateGymClassDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
};
