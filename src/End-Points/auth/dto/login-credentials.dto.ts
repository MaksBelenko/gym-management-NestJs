import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { PasswordRegex } from '../../../shared/regex.constants';

export class LoginCredentialsDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(PasswordRegex, { message: 'Weak password'})
    password: string;
}