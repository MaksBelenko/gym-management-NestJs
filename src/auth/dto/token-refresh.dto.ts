import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { JwtRegex } from '../../regex.constants';

export class TokenRefreshDto {

    @IsNotEmpty()
    @Matches(JwtRegex, 
        { message: 'Incorrect JWT'})
    accessToken: string;
}