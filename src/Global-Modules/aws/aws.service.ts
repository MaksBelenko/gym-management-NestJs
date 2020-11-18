import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { ImageBuffers } from '../../shared/image-buffers.interface';
import { Dictionary } from 'lodash';
import { ImageSize } from '../../shared/image-size.enum';

@Injectable()
export class AwsService {
    private s3 = new S3();

    constructor(private configService: ConfigService) {}

    /**
     * Uploading multiple images
     * @param name Name to be used for the image
     * @param imageBuffers Buffers of images
     */
    async uploadMultipleImages(
        name: string,
        imageBuffers: ImageBuffers[],
    ): Promise<Dictionary<string>> {
        let awsKeysDictionary: Dictionary<string> = {};
        const imageUUID = uuidv4();

        await Promise.all(
            imageBuffers.map(async imageData => {
                const uploadResult = await this.uploadSingleImage(
                    name,
                    imageData.buffer,
                    imageData.type,
                    imageUUID,
                );

                awsKeysDictionary[imageData.type] = uploadResult.Key;
            }),
        );

        return awsKeysDictionary;
    }


    async uploadSingleImage(
        name: string,
        buffer: Buffer,
        type?: ImageSize,
        uuid?: string,
    ): Promise<S3.ManagedUpload.SendData> {
        const imageUUID = uuid ? uuid : uuidv4();

        const keyName = type
            ? `${name}-${type}-${imageUUID}.png`
            : `${name}-${imageUUID}.png`;

        return this.s3
            .upload({
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Body: buffer,
                Key: keyName,
            })
            .promise();
    }

    /**
     * Download an image from S3
     * @param nameKey Name of the image to download
     */
    async downloadImage(nameKey: string) {
        const stream = await this.s3
            .getObject({
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: nameKey,
            })
            .createReadStream();

        return { stream };
    }


    async deleteMultipleImages(nameKeys: string[]): Promise<void> {
        await Promise.all(nameKeys.map(async key => {
            await this.deleteSingleImage(key);
        }));
    }

    async deleteSingleImage(key: string): Promise<void> {
        await this.s3.deleteObject({
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Key: key,
        })
        .promise();
    }
}
