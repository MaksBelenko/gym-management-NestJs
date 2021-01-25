import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AwsService } from './aws.service';
import awsConnectionConfig from '../../config/aws.config'

// @Global()
@Module({
  imports: [
    ConfigModule.forFeature(awsConnectionConfig),
  ],
  providers: [
    S3,
    AwsService,
  ],
  exports: [AwsService]
})
export class AwsModule {}
