import { IsEmail, Matches } from 'class-validator';
import { EmailRegex } from '../../regex.constants';
export class PasswordResetDto {

    @IsEmail()
    email: string;
}