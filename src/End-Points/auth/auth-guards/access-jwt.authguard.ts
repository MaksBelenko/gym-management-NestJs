import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessJwtGuard extends AuthGuard('jwt-access-strategy') {}
