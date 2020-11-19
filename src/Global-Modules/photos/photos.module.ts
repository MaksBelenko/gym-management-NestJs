import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';

@Module({
  providers: [PhotosService]
})
export class PhotosModule {}
