import { Test, TestingModule } from '@nestjs/testing';
import { TokenStorageService } from '../token-storage.service';
import { LocalAuthTokenRepository } from '../local-auth-token.repository';

const mockRepository = () => ({})

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenStorageService,
        {
          provide: LocalAuthTokenRepository,
          useFactory: mockRepository, 
        }
      ],
    }).compile();

    service = module.get<TokenStorageService>(TokenStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
