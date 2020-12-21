import { IsEmail, Matches } from 'class-validator';
import { EmailRegex } from '../../regex.constants';
export class PasswordResetDto {
    
    @IsEmail()
    @Matches(EmailRegex, { message: 'Email incorrectly formatted'})
    email: string;
}