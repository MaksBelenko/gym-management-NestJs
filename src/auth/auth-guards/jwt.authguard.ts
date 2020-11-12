import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class AccessJwtGuard extends AuthGuard('jwt-access-strategy') {}

@Injectable()
export class RefreshJwtGuard extends AuthGuard('jwt-refresh-strategy') {}
