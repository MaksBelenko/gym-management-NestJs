import { registerAs } from "@nestjs/config";

export default registerAs('mailConfig', () => ({
    confirmTimeoutSeconds: parseInt(process.env.CONFIRM_ACCOUNT_TIMEOUT_SECONDS),
    mailSenderName: process.env.MAIL_RESPONSE_NAME,
    emailSenderName: process.env.MAIL_RESPONSE_EMAIL,
    emailsPerSecondLimit: process.env.MAIL_RATE_PER_SECOND,
}));