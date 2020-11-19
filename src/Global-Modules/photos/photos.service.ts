import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictionary } from 'lodash';
import { PhotoRepository } from './photo.repository';
import { Photo } from './photo.entity';
import { AwsService } from '../aws/aws.service';
import { ImageProcessingService } from '../image-processing/image-processing.service';
import { stringList } from 'aws-sdk/clients/datapipeline';

@Injectable()
export class PhotosService {

    constructor(
        private awsService: AwsService,
        private imageProcessingService: ImageProcessingService,
        @InjectRepository(PhotoRepository)
        private photoRepository: PhotoRepository,
    ) {}


    async generatePhoto(name: string, imageFile: Express.Multer.File): Promise<Photo> {
        const awsImageKeysDictionary = await this.processAndUploadImage(imageFile, name);
        return this.photoRepository.saveAwsKeys(awsImageKeysDictionary);
    }


    async deletePhotos(photos: Photo[]): Promise<void> {
        const allImageNames = this.photoRepository.getAllImagesNames(photos); 

        if (allImageNames) {
            await this.awsService.deleteMultipleImages(allImageNames);
            await this.photoRepository.deletePhotos(photos);
        }
    }


    async downloadImage(name: string) {
        return this.awsService.downloadImage(name);
    }

    /**
     * Resizes an image and uploads it to AWS S3 with thumbnails
     * @param imageFile file to resize and upload to aws S3
     * @param name name of the file
     */
    private async processAndUploadImage(
        imageFile: Express.Multer.File,
        name: string,
    ): Promise<Dictionary<string>> {
        const thumbBuffers = await this.imageProcessingService.resizeImage(
            imageFile,
        );

        return this.awsService.uploadMultipleImages(name,thumbBuffers);
    }
}
