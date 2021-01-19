import { Role } from '../../End-Points/auth/RBAC/role.enum';

export interface JwtPayload {
    email: string;
    role: Role;
}