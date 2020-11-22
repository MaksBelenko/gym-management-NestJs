import { IsEmail, IsLowercase, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { EmailRegex } from '../../regex.constants';

export class AuthCredentialsDto {

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    fullName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(EmailRegex, 
    { message: 'Weak password'})
    password: string;
}