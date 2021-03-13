import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { ImageBuffers } from '../../shared/image-buffers.interface';
import { Dictionary } from 'lodash';
import { ImageSize } from '../../shared/image-size.enum';
import awsConnectionConfig from '../../config/aws.config';
import internal from 'stream';

@Injectable()
export class AwsService {

    private readonly logger = new Logger(this.constructor.name);

    constructor(
        @Inject(awsConnectionConfig.KEY) private readonly awsConfig: ConfigType<typeof awsConnectionConfig>,
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
                Bucket: this.awsConfig.photosBucketName,
                Body: buffer,
                Key: keyName,
            })
            .promise();
    }

    /**
     * Download an image from S3
     * @param nameKey Name of the image to download
     */
    async downloadImage(nameKey: string): Promise<{ stream: internal.Readable, contentLength: number }> {
        const object = this.s3.getObject({
            Bucket: this.awsConfig.photosBucketName,
            Key: nameKey,
        });

        const params = { 
            Bucket: this.awsConfig.photosBucketName,
            Key: nameKey
        }

        let contentLength = 0;

        try { 
            const headCode = await this.s3.headObject(params).promise();
            contentLength = headCode.ContentLength
            const signedUrl = await this.s3.getSignedUrlPromise('getObject', params);
            const r = 5
            // Do something with signedUrl
          } catch (headErr) {
            this.logger.error(`Image with key: ${nameKey} could not be found; Error message = ${headErr.message}`, headErr);
            throw new NotFoundException(`Image with key: ${nameKey} could not be found`)
          }

        const stream = object.createReadStream()
        
        return { stream, contentLength };
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
            Bucket: this.awsConfig.photosBucketName,
            Key: key,
        })
        .promise();
    }
}
