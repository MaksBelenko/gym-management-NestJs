import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { MailSenderService } from './mail-sender.service';
import { MailProcessor } from './mail.processor';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('MAIL_HOST'),
                    port: configService.get<string>('MAIL_SMTP_PORT'),
                    secure: false, //configService.get('MAIL_SECURE'),
                    // tls: { ciphers: 'SSLv3', }, // gmail
                    auth: {
                        user: configService.get<string>('MAIL_USER'),
                        pass: configService.get<string>('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"${configService.get('MAIL_RESPONSE_NAME',)}" <${configService.get('MAIL_RESPONSE_EMAIL')}>`,
                },
                template: {
                    dir: __dirname + '/mail-templates',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueueAsync({
            name: 'emails-queue',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<BullModuleOptions> => ({
                redis: {
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                },
                prefix: 'bull_',
                limiter: {
                    max: configService.get('MAIL_RATE_PER_SECOND'),
                    duration: 1_000,
                },
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: true,
                    attempts: 1,
                    timeout: 10_000
                }
            }),
        }),
    ],
    providers: [
        MailSenderService,
        MailProcessor,
    ],
    exports: [MailSenderService],
})
export class MailSenderModule {}
