import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { ImageBuffers } from '../../shared/image-buffers.interface';
import { Dictionary } from 'lodash';
import { ImageSize } from '../../shared/image-size.enum';
import awsConnectionConfig from '../../config/aws.config';

@Injectable()
export class AwsService {

    constructor(
        @Inject(awsConnectionConfig.KEY) private readonly awsConsts: ConfigType<typeof awsConnectionConfig>,
        private readonly s3: S3,
    ) {}

    /**
     * Uploading multiple images
     * @param name Name to be used for the image
     * @param imageBuffers Buffers of images
     */
    async uploadMultipleImages(
        name: string,
        imageBuffers: ImageBuffers[],
    ): Promise<Dictionary<string>> {
        const awsKeysDictionary: Dictionary<string> = {};
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
                Bucket: this.awsConsts.photosBucketName,
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
        const stream = this.s3.getObject({
            Bucket: this.awsConsts.photosBucketName,
            Key: nameKey,
        })
        .createReadStream()

        return { stream };
    }


    /**
     * Removes all the files from S3 with specified keys
     * @param nameKeys Keys from S3
     */
    async deleteMultipleImages(nameKeys: string[]): Promise<void> {
        await Promise.all(nameKeys.map(async key => {
            await this.deleteSingleImage(key);
        }));
    }

    async deleteSingleImage(key: string): Promise<void> {
        await this.s3.deleteObject({
            Bucket: this.awsConsts.photosBucketName,
            Key: key,
        })
        .promise();
    }
}
