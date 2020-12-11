import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailSenderService {

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    public sendEmail(): void {
        this.mailerService
            .sendMail({
                to: 'maksim.belenko@gmail.com', // list of receivers
                from: this.configService.get('MAIL_RESPONSE_EMAIL'), // sender address
                subject: 'Testing Nest MailerModule ✔', // Subject line
                text: 'welcome', // plaintext body
                html: '<b>Its Maks, let me know if this works... hope it works :)</b>', // HTML body content
            })
            .then(() => {
                console.log("Email sent");
            })
            .catch((err) => {
                console.log("Error:  " + err);
            });
    }
}
