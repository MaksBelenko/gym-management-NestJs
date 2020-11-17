import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as util from 'util';
import { ImageSize } from '../../shared/image-size.enum';
import { ImageBuffers } from '../../shared/image-data.interface';

@Injectable()
export class ImageProcessingService {
    private readFileAsync = util.promisify(fs.readFile);
    private sizes = [
        { type: ImageSize.LARGE, numericSize: 1024 },
        { type: ImageSize.MEDIUM, numericSize: 500 },
        { type: ImageSize.SMALL, numericSize: 100 },
    ];

    /**
     * Resizes the image and outputs and new imae buffer
     * @param file Image file to be resized
     */
    async resizeImage(file: Express.Multer.File): Promise<ImageBuffers[]> {
        let imageBuffers: ImageBuffers[] = [];

        const imageBuffer = await this.readFileAsync(file.path);

        await Promise.all(
            this.sizes.map(async size => {
                const newBuffer = await sharp(imageBuffer)
                    .resize(size.numericSize, size.numericSize, {
                        fit: 'inside',
                    })
                    .png()
                    .toBuffer();

                imageBuffers.push({
                    type: size.type,
                    buffer: newBuffer,
                });
            }),
        );

        console.log(imageBuffers);
        return imageBuffers;
    }

    private;
}
