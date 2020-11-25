import { Test, TestingModule } from '@nestjs/testing';
import { AwsService } from './aws.service';
import { ConfigService } from '@nestjs/config';

const mockConfigService = () => ({
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
        }
      ],
    }).compile();

    service = module.get<AwsService>(AwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
