import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RenewTokensGuard extends AuthGuard('no-user-refresh-strategy') {}