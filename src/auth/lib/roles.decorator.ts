import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

export const ROLES_KEY = 'roles';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
