import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AwsService } from './aws.service';
import awsConnectionConfig from '../../config/aws.config'

// @Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConnectionConfig],
      validationSchema: Joi.object({
        AWS_ACCESS_KEY_ID: Joi.required(),
        AWS_SECRET_ACCESS_KEY: Joi.required(),
        AWS_REGION: Joi.required(),
        AWS_PHOTOS_BUCKET_NAME: Joi.required(),
      })
    }),
  ],
  providers: [
    S3,
    AwsService,
  ],
  exports: [AwsService]
})
export class AwsModule {}
