import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { SES } from 'aws-sdk';
import { MailSenderService } from './mail-sender.service';
import { MailProcessor } from './mail.processor';
import { EmailConfirmationCodeService } from './email-confirmation-codes.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import mailConfig from '../../config/mail.config';

@Module({
    imports: [
        ConfigModule.forFeature(mailConfig),
        RedisCacheModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    SES: new SES({
                        accessKeyId: configService.get('AWS_ACCESS_KEY'),
                        secretAccessKey: configService.get('AWS_SECRET_KEY'),
                        region: configService.get('AWS_REGION')
                    })
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
        EmailConfirmationCodeService,
    ],
    exports: [
        MailSenderService,
        EmailConfirmationCodeService
    ],
})
export class MailSenderModule {}
