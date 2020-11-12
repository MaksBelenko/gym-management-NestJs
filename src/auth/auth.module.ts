import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { jwtConstants } from './constants/jwt.constants';
import { JwtAccessStrategy } from './passport-strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './passport-strategies/jwt-refresh.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({
      // secret: jwtConstants.secret,
      // signOptions: {
      //   expiresIn: jwtConstants.expiresIn,
      // }
    }),
    TypeOrmModule.forFeature([UserRepository])
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
