import { Test, TestingModule } from '@nestjs/testing';
import { TokenStorageService } from '../token-storage.service';
import { LocalAuthTokenRepository } from '../local-auth-token.repository';
import { Connection } from 'typeorm';
import { ConfigModule, registerAs } from '@nestjs/config';

// const mockRepository = () => ({})
const mockDbConnection = () => ({
  getCustomRepository: jest.fn(),
});

const localTokenConfig = registerAs('localTokenConfig', () => ({
  accessToken: {
      expiresIn: '30s'
  },
  refreshToken: {
      expiresIn: '1m'
  }
}));


describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(localTokenConfig)
      ],
      providers: [
        TokenStorageService,
        {
          provide: Connection,
          useFactory: mockDbConnection, 
        },
      ],
    }).compile();

    service = module.get<TokenStorageService>(TokenStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
