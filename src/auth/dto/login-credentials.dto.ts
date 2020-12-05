import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { PasswordRegex, EmailRegex } from '../../regex.constants';

export class LoginCredentialsDto {
    @IsEmail()
    @Matches(EmailRegex, { message: 'Email incorrectly formatted'})
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(PasswordRegex, { message: 'Weak password'})
    password: string;
}