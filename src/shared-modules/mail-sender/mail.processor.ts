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
import { plainToClass } from 'class-transformer';
import { ConfirmationQueueData } from './interfaces/confirm-data.interface';
import { PasswordResetData } from './interfaces/password-reset-data.interface';
import { confirmationEmailQueueName, resetPasswordQueueName } from './email.consts';

@Processor('emails-queue')
export class MailProcessor {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly mailerService: MailerService) {}


    //#region Queue Events
    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(
            `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`,
        );
    }

    @OnQueueCompleted()
    onComplete(job: Job, result: any) {
        delete result.raw

        this.logger.debug(
            `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`,
        );
    }

    @OnQueueFailed()
    onError(job: Job<any>, error: any) {
        this.logger.error(
            `Failed job ${job.id} of type ${job.name}: ${error.message}`,
            error.stack,
        );
    }

    //#endregion


    //#region Queue Processes
    @Process(confirmationEmailQueueName)
    async sendAccountConfirmationEmail(
        job: Job<ConfirmationQueueData>,
    ): Promise<any> {
        this.logger.log(`Sending confirmation email to '${job.data.email}'...`);

        const { email, customerName, confirmationCode } = job.data;

        const url = `https://google.com`;
        // const url = `${config.get('server.origin')}/auth/${job.data.confirmationCode}/confirm`

        try {
            const result = await this.mailerService.sendMail({
                template: 'confirmation',
                context: {
                    //   ...plainToClass(User, job.data.user),
                    customerName,
                    confirmationCode,
                },
                subject: `Подтвердите Ваш электронный адрес для аккаунта Energy Fitness`,
                to: email,
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

    @Process(resetPasswordQueueName)
    async sendPasswordResetEmail(
        job: Job<PasswordResetData>,
    ): Promise<any> { 

        try {
            const { customerName, passwordResetUrl, email } = job.data;

            
            const result = await this.mailerService.sendMail({
                template: 'password-reset',
                context: {
                    customerName,
                    passwordResetUrl,
                },
                subject: `Запрос на изменение пароля`,
                to: email,
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
    //#endregion
}
