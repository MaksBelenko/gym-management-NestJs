import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtAccessStrategy } from './passport-strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './passport-strategies/jwt-refresh.strategy';
import { TokensModule } from '../Shared-Modules/tokens/tokens.module';
import { RedisCacheModule } from '../Shared-Modules/redis-cache/redis-cache.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserRepository]),
    TokensModule,
    RedisCacheModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    PassportModule,
  ]
})
export class AuthModule {}
