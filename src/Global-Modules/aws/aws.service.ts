import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
    private s3 = new S3();

    constructor(private configService: ConfigService) {}

    async uploadImage(
        name: string,
        imageBuffer: Buffer,
    ): Promise<S3.ManagedUpload.SendData> {
        const uploadResult = await this.s3
            .upload({
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Body: imageBuffer,
                Key: name,
                // Key: `${uuid()}-${name}`,
            })
            .promise();

        return uploadResult;
    }

    async getPrivateFile() {
        const stream = await this.s3
            .getObject({
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: 'helloooooo',
            })
            .createReadStream();

        return { stream };
    }
}
