import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { ConfirmationQueueData } from './confirm-data.interface';
import { plainToClass } from 'class-transformer';

@Processor('emails-queue')
export class MailProcessor {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly mailerService: MailerService) {}

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(
            `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`,
        );
    }

    //#region Test region
    @OnQueueCompleted()
    onComplete(job: Job, result: any) {
        this.logger.debug(
            `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`,
        );
    }
    //#endregion

    @OnQueueFailed()
    onError(job: Job<any>, error: any) {
        this.logger.error(
            `Failed job ${job.id} of type ${job.name}: ${error.message}`,
            error.stack,
        );
    }

    @Process('confirmation')
    async sendAccountConfirmationEmail(
        job: Job<ConfirmationQueueData>,
    ): Promise<any> {
        this.logger.log(`Sending confirmation email to '${job.data.email}...'`);

        const url = `https://google.com`;
        // const url = `${config.get('server.origin')}/auth/${job.data.confirmationCode}/confirm`

        // if (config.get<boolean>('mail.live')) {
        //   return 'SENT MOCK CONFIRMATION EMAIL'
        // }

        try {
            const result = await this.mailerService.sendMail({
                template: 'confirmation',
                context: {
                    //   ...plainToClass(User, job.data.user),
                    email: job.data.email,
                    url: url,
                },
                subject: `Пожалуйста подтвердите Ваш имейл для аккаунта Energy Fitness`,
                to: job.data.email,
            });
            return result;
        } catch (error) {
            this.logger.error(
                `Failed to send confirmation email to '${job.data.email}'`,
                error.stack,
            );
            throw error;
        }
    }
}
