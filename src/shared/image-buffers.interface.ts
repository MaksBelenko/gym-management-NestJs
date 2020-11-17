import { ImageSize } from './image-size.enum';

export interface ImageBuffers {
    type: ImageSize,
    buffer: Buffer,
}