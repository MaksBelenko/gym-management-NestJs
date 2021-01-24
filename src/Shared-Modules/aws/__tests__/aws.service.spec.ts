import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsService } from '../aws.service';
import { S3 } from 'aws-sdk';
// import awsConConfig from '../../../config/aws.config';
import { registerAs } from '@nestjs/config';


const mockConfigService = () => ({
});
const mockS3 = () => ({

});
const awsConf = registerAs('awsConnectionConfig', () => ({
  photosBucketName: 'test-bucket-name',
}));


describe('AwsService', () => {
  let service: AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [awsConf]
        })
      ],
      providers: [
        AwsService,
        {
          provide: ConfigModule,
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
