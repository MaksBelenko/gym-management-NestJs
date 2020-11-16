import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as util from 'util';

@Injectable()
export class ImageProcessingService {

    private readFileAsync = util.promisify(fs.readFile)


    /**
     * Resizes the image and outputs and new imae buffer
     * @param file Image file to be resized
     * @param width Required width
     * @param height Required height
     */
    async resizeImage(file: Express.Multer.File, sizes: number[]): Promise<Buffer[]> {
        let imageBuffers: Buffer[] =[];
        
        const imageBuffer = await this.readFileAsync(file.path);

        await Promise.all(sizes.map(async (size) => {
            const newBuffer = await sharp(imageBuffer)
                                        .resize(size, size, { fit: 'inside' })
                                        .png()
                                        .toBuffer();
                                        
            imageBuffers.push(newBuffer);
          }));

        return imageBuffers;
    }
}
