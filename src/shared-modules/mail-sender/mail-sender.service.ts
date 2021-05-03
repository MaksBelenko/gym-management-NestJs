import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfirmationQueueData } from './interfaces/confirm-data.interface';
import { PasswordResetData } from './interfaces/password-reset-data.interface';
import { confirmationEmailQueueName, resetPasswordQueueName } from './email.consts';

@Injectable()
export class MailSenderService {

    private logger = new Logger(this.constructor.name);

    constructor(
        @InjectQueue('emails-queue') private mailQueue: Queue,
    ) {}

    async sendPasswordResetEmail(toEmail: string, customerName: string, passwordResetUrl: string): Promise<void> {

        try {
            const data: PasswordResetData = { email: toEmail, passwordResetUrl, customerName };
            await this.mailQueue.add(resetPasswordQueueName, data);

            this.logger.log(`Added password reset email sending action to queue for ${customerName} (${toEmail}) and password reset URL ${passwordResetUrl}`)

        } catch (error) {
            this.logger.error(`Error queueing password reset email action to ${customerName} (${toEmail})`);
        }
    }



    async sendConfirmationEmail(toEmail: string, customerName: string, emailConfirmationUrl: string): Promise<void> {

        try {
            const data: ConfirmationQueueData = { email: toEmail, customerName, emailConfirmationUrl };
            await this.mailQueue.add(confirmationEmailQueueName, data);

            this.logger.log(`Added confirmation email sending action to queue for ${toEmail} with confirmation url ${emailConfirmationUrl}`)

        } catch (error) {
            this.logger.error(`Error queueing confirmation email to ${toEmail}`);
        }
    }

    // async sendConfirmationEmail(toEmail: string, customerName: string, confirmationCode: string): Promise<void> {

    //     try {
    //         const data: ConfirmationQueueData = { email: toEmail, customerName, confirmationCode };
    //         await this.mailQueue.add(confirmationEmailQueueName, data);

    //         this.logger.log(`Added confirmation email sending action to queue for ${toEmail} with confirmation code ${confirmationCode}`)

    //     } catch (error) {
    //         this.logger.error(`Error queueing confirmation email to ${toEmail}`);
    //     }
    // }
}
