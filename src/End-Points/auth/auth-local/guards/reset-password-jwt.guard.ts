import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtResetPasswordStrategyName } from '../passport-strategies/jwt-reset-password.strategy';

@Injectable()
export class ResetPasswordJwtGuard extends AuthGuard(JwtResetPasswordStrategyName) {}