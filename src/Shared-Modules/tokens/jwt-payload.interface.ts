import { Role } from '../../end-points/auth/RBAC/role.enum';

export interface JwtPayload {
    email: string;
    role: Role;
}