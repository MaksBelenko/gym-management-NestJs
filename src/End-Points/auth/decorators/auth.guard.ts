import {
    applyDecorators,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { AccessJwtGuard } from '../auth-local/guards/access-jwt.guard';
import { RolesGuard } from '../RBAC/roles.guard';
import { IsPublicRoute } from './public.decorator';

export enum AuthPolicy {
    // Google,
    Local,
    None
}

export function Auth(authPolicy: AuthPolicy) {

    const publicRoute = (authPolicy === AuthPolicy.None);

    if (publicRoute) {
        return applyDecorators(
            IsPublicRoute(publicRoute),
        );
    }

    return applyDecorators(
        IsPublicRoute(publicRoute),
        UseGuards(AccessJwtGuard, RolesGuard),
        // ApiBearerAuth(),
        // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
