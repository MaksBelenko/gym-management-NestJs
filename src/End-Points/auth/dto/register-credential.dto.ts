import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { PasswordRegex } from '../../../shared/regex.constants';

export class RegisterCredentialsDto {

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    fullName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(PasswordRegex, { message: 'Weak password'})
    password: string;
}