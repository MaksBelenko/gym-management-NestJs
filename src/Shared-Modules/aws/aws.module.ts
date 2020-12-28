import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { S3 } from 'aws-sdk';

// @Global()
@Module({
  providers: [
    S3,
    AwsService,
  ],
  exports: [AwsService]
})
export class AwsModule {}
