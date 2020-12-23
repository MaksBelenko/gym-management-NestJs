import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../redis-cache/redis-cache.service';


interface CodeConfirmationData {
    code: string;
}


@Injectable()
export class EmailConfirmationCodeService {

    private queuePrefix = 'email_validation:';

    private generateRandomSixDigitNumber = new Promise<number>((resolve, reject) => {
        const value: number = Math.floor(100000 + Math.random() * 900000);
        resolve(value)
    });

    private redisMinute = 60;

    constructor(
        private readonly redisCacheService: RedisCacheService,
    ) {}


    async generateConfirmationCode(email: string): Promise<string> {
        const code = await this.generateCode();
        const data: CodeConfirmationData = { code };

        const key = this.queuePrefix + email;
        await this.redisCacheService.set(key, data, 10 * this.redisMinute);
        
        return code;
    }

    async codeMatches(email: string, confirmationCode: string): Promise<boolean> {
        const key = this.queuePrefix + email;
        const data = await this.redisCacheService.get<CodeConfirmationData>(key);
        
        if (!data) return false;
        if (!data.code) return false;

        await this.redisCacheService.del(key);
        
        return (data.code == confirmationCode) ? true : false;
    }


    private async generateCode(): Promise<string> {
        return (await this.generateRandomSixDigitNumber).toString();
    }
}