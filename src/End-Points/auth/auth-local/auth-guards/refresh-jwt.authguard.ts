import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtRefreshStrategyName } from '../passport-strategies/jwt-refresh.strategy';

@Injectable()
export class RefreshJwtGuard extends AuthGuard(JwtRefreshStrategyName) {}