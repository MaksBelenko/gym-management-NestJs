import { Test, TestingModule } from '@nestjs/testing';
import { PhotosService } from './photos.service';
import { AwsService } from '../aws/aws.service';
import { ImageProcessingService } from '../image-processing/image-processing.service';
import { PhotoRepository } from './photo.repository';

const mockAwsService = () => ({
});
const mockImageProcessingService = () => ({
});
const mockPhotoRepositoryService = () => ({
});

describe('PhotosService', () => {
  let service: PhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: PhotoRepository,
          useFactory: mockPhotoRepositoryService,
        },
        {
          provide: AwsService,
          useFactory: mockAwsService,
        },
        {
          provide: ImageProcessingService,
          useFactory: mockImageProcessingService,
        }
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
