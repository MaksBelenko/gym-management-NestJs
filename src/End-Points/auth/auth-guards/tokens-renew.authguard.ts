import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RenewTokensStrategyName } from '../passport-strategies/renew-tokens.strategy';

@Injectable()
export class RenewTokensGuard extends AuthGuard(RenewTokensStrategyName) {}