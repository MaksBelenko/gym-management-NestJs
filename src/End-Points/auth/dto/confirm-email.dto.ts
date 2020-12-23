import { IsEmail, Max, Min, MinLength, MaxLength } from 'class-validator';

export class ConfirmEmailDto {

    @IsEmail()
    email: string;

    @MinLength(6)
    @MaxLength(8)
    // @Max(6)
    code: string;
}