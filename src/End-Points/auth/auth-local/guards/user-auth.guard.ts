import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessJwtGuard } from './access-jwt.guard';
import { RolesGuard } from '../../RBAC/roles.guard';

@Injectable()
export class UserAuthGuard implements CanActivate {

  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly accessJwtGuard: AccessJwtGuard,
    private readonly rolesGuard: RolesGuard,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const jwtAuthResult = await this.accessJwtGuard.canActivate(context);

    if (!jwtAuthResult) {
      this.logger.log(`Cannot pass accessJwtGuard`);
      return false;
    }

    const rolesAuthResult = await this.rolesGuard.canActivate(context);

    if (!rolesAuthResult) {
      this.logger.log(`Cannot pass rolesAuthResult`);
      return false;
    }

    return true;
  }
}
