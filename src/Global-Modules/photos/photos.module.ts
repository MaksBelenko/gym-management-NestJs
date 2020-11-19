import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosService } from './photos.service';
import { PhotoRepository } from './photo.repository';
import { ImageProcessingModule } from '../image-processing/image-processing.module';
import { AwsModule } from '../aws/aws.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoRepository]),
    ImageProcessingModule,
    AwsModule,
  ],  
  providers: [PhotosService],
  exports: [PhotosService]
})
export class PhotosModule {}
