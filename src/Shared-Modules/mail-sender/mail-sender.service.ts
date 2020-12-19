import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { resetPasswordHtmlTemplate } from './email-template/reset-password.template';

@Injectable()
export class MailSenderService {

    private logger = new Logger(MailSenderService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    public async sendEmail(toEmail: string, customerName: string, passwordResetUrl: string): Promise<void> {

        await this.mailerService.sendMail({
                to: toEmail, // list of receivers
                from: `"${this.configService.get('MAIL_RESPONSE_NAME')}" <${this.configService.get('MAIL_RESPONSE_EMAIL')}>`, // sender address
                subject: 'Запрос на изменение пароля', // Subject line
                text: 'Password reset', // plaintext body
                html: resetPasswordHtmlTemplate(customerName, passwordResetUrl), // HTML body content
            });

        this.logger.log(`Email sent to customer named: ${customerName} email: ${toEmail} passwordResetUrl: ${passwordResetUrl}`)
    }
}
