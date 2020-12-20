import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { resetPasswordHtmlTemplate } from './mail-templates/reset-password.template';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfirmationQueueData } from './confirm-data.interface';

@Injectable()
export class MailSenderService {

    private logger = new Logger(MailSenderService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        @InjectQueue('emails-queue')
        private mailQueue: Queue,
    ) {}

    async sendEmail(toEmail: string, customerName: string, passwordResetUrl: string): Promise<void> {

        try {
            await this.mailerService.sendMail({
                to: toEmail, // list of receivers
                from: `"${this.configService.get('MAIL_RESPONSE_NAME')}" <${this.configService.get('MAIL_RESPONSE_EMAIL')}>`, // sender address
                subject: 'Запрос на изменение пароля', // Subject line
                text: 'Password reset', // plaintext body
                html: resetPasswordHtmlTemplate(customerName, passwordResetUrl), // HTML body content
            });

            this.logger.log(`Password reset email sent to customer named: ${customerName} email: ${toEmail} passwordResetUrl: ${passwordResetUrl}`) 

        } catch (error) {
            this.logger.error(`Error appeared when sending the email to ${customerName} (${toEmail}) with passwordResetUrl: ${passwordResetUrl}`)
        }
    }


    async sendTest(toEmail: string, customerName: string, confirmationCode: string): Promise<void> {

        try {
            const data: ConfirmationQueueData = { email: toEmail, confirmationCode };
            await this.mailQueue.add('confirmation', data);

            this.logger.log(`Added confirmation email sending action to queue for ${toEmail} with confirmation code ${confirmationCode}`)

          } catch (error) {
            this.logger.error(`Error queueing confirmation email to ${toEmail}`);
          }
    }


    // async sendConfirmationEmail(user: User, code: string): Promise<boolean> {
    //     try {
    //       await this.mailQueue.add('confirmation', {
    //         user,
    //         code,
    //       })
    //       return true
    //     } catch (error) {
    //       // this.logger.error(`Error queueing confirmation email to user ${user.email}`)
    //       return false
    //     }
    //   }
}
