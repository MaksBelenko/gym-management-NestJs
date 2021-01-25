import * as Joi from '@hapi/joi';

export const JoiValidationSchema = Joi.object({

    //# SERVER
    PORT: Joi.number().positive().required(),
    BASE_URL: Joi.string().required(),

    //# DATABASE
    DATABASE_TYPE: Joi.string().required(),
    RDS_HOSTNAME: Joi.string().required(),
    RDS_PORT: Joi.number().positive().required(),
    RDS_USERNAME: Joi.string().required(),
    RDS_PASSWORD: Joi.required(),
    RDS_DB_NAME: Joi.string().required(),
    TYPEORM_SYNC: Joi.boolean().required(),

    //# REDIS
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().positive().integer().required(),

    //# LOCAL AUTH
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
    JWT_PASSWORD_RESET_SECRET: Joi.string().required(),
    JWT_PASSWORD_RESET_EXPIRES_IN: Joi.string().required(),

    //# AWS
    AWS_ACCESS_KEY_ID: Joi.required(),
    AWS_SECRET_ACCESS_KEY: Joi.required(),
    AWS_REGION: Joi.required(),
    AWS_PHOTOS_BUCKET_NAME: Joi.required(),

    //# GOOGLE AUTH
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_SECRET: Joi.string().required(),
    
    //# Mailer
    CONFIRM_ACCOUNT_TIMEOUT_SECONDS: Joi.number().positive().integer().required(),
    MAIL_RESPONSE_NAME: Joi.string().required(),
    MAIL_RESPONSE_EMAIL: Joi.string().email().required(), //.pattern(EmailRegex)
    MAIL_RATE_PER_SECOND: Joi.number().positive().integer().required(),
});