import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as util from 'util';
import { ImageSize } from '../../shared/image-size.enum';
import { ImageBuffers } from '../../shared/image-buffers.interface';

@Injectable()
export class ImageProcessingService {
    private readFileAsync = util.promisify(fs.readFile);
    private sizes = [
        { type: ImageSize.LARGE, numericSize: 1024 },
        { type: ImageSize.MEDIUM, numericSize: 500 },
        { type: ImageSize.SMALL, numericSize: 100 },
    ];

    /**
     * Resizes the image and outputs and new image buffer
     * @param file Image file to be resized
     */
    async resizeImage(file: Express.Multer.File): Promise<ImageBuffers[]> {
        const imageBuffers: ImageBuffers[] = [];

        const imageBuffer = await this.readFileAsync(file.path);

        await Promise.all(
            this.sizes.map(async size => {
                const newBuffer = await sharp(imageBuffer)
                    .resize(size.numericSize, size.numericSize, {
                        fit: 'inside',
                    })
                    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
                    .toBuffer();

                imageBuffers.push({
                    type: size.type,
                    buffer: newBuffer,
                });
            }),
        );

        return imageBuffers;
    }
}
