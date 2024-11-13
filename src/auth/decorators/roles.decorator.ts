import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../enums/rol.enum';

export const ROLES_KEY = 'roles';
export const Roles = (role: ROLE) => SetMetadata(ROLES_KEY, role);
