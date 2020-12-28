import { Test, TestingModule } from '@nestjs/testing';
import { AwsService } from '../aws.service';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

const mockConfigService = () => ({
});
const mockS3 = () => ({

});

describe('AwsService', () => {
  let service: AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsService,
        {
          provide: ConfigService,
          useFactory: mockConfigService,
        },
        {
          provide: S3,
          useFactory: mockS3,
        }
      ],
    }).compile();

    service = module.get<AwsService>(AwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
