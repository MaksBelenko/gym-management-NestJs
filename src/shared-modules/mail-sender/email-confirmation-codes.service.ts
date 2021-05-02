import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import mailConfiguration from 'src/config/mail.config';
import { RedisCacheService } from '../redis-cache/redis-cache.service';


interface CodeConfirmationData {
    code: string;
}


@Injectable()
export class EmailConfirmationCodeService {

    private readonly queuePrefix = 'email_validation:';

    private readonly generateRandomSixDigitNumber = (min: number, max: number) => {
        return new Promise<number>((resolve, reject) => {
            const value: number = Math.floor(Math.random()*(max-min+1)+min);
            resolve(value)
        });
    } 

    constructor(
        private readonly redisCacheService: RedisCacheService,
        @Inject(mailConfiguration.KEY) private readonly mailConfig: ConfigType<typeof mailConfiguration>,
    ) {}


    async generateConfirmationCode(email: string): Promise<string> {
        const code = await this.generateCode();
        const data: CodeConfirmationData = { code };

        const key = this.getRedisKeyFor(email);
        await this.redisCacheService.set(key, data,  this.mailConfig.confirmTimeoutSeconds);
        
        return code;
    }

    async codeMatches(email: string, confirmationCode: string): Promise<boolean> {
        const key = this.getRedisKeyFor(email);
        const data = await this.redisCacheService.get<CodeConfirmationData>(key);
        
        if (!data || !data.code || data.code != confirmationCode) {
            return false;
        }

        await this.redisCacheService.del(key);
        
        return true;
    }


    private async generateCode(): Promise<string> {
        return (await this.generateRandomSixDigitNumber(100_000, 999_999)).toString();
    }

    private getRedisKeyFor(email: string): string {
        return this.queuePrefix + email;
    }
}