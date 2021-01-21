import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { ACCOUNT_CONFIRM_TIMEOUT } from './email.consts';


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
        @Inject(ACCOUNT_CONFIRM_TIMEOUT) private readonly confirmCodeTimeoutSeconds: number,
    ) {}


    async generateConfirmationCode(email: string): Promise<string> {
        const code = await this.generateCode();
        const data: CodeConfirmationData = { code };

        const key = this.getRedisKeyFor(email);
        await this.redisCacheService.set(key, data, this.confirmCodeTimeoutSeconds);
        
        return code;
    }

    async codeMatches(email: string, confirmationCode: string): Promise<boolean> {
        const key = this.getRedisKeyFor(email);
        const data = await this.redisCacheService.get<CodeConfirmationData>(key);
        
        if (!data) return false;
        if (!data.code) return false;

        await this.redisCacheService.del(key);
        
        return (data.code == confirmationCode) ? true : false;
    }


    private async generateCode(): Promise<string> {
        return (await this.generateRandomSixDigitNumber(100_000, 999_999)).toString();
    }

    private getRedisKeyFor(email: string): string {
        return this.queuePrefix + email;
    }
}