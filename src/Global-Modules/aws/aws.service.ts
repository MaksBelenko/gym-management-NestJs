import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { ImageBuffers } from '../../shared/image-data.interface';
import { ImageSize } from '../../shared/image-size.enum';
import { Dictionary } from 'lodash';

@Injectable()
export class AwsService {
    private s3 = new S3();

    constructor(private configService: ConfigService) {}

    async uploadImages(
        name: string,
        imageBuffers: ImageBuffers[],
    ): Promise<Dictionary<string>> {

        let awsImageKeysData: { type: ImageSize, bucketImageKey: string }[] = []; 

        var awsKeysDictionary: Dictionary<string> = {};

        const imageUUID = uuidv4();

        await Promise.all(
            imageBuffers.map(async imageData => {
                const uploadResult = await this.s3
                    .upload({
                        Bucket: this.configService.get('AWS_BUCKET_NAME'),
                        Body: imageData.buffer,
                        Key: `${name}-${imageData.type}-${imageUUID}.png`,
                    })
                    .promise();

                awsKeysDictionary[imageData.type] = uploadResult.Key;
            }),
        );

        return awsKeysDictionary;
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
