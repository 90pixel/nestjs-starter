import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum';
import { ROLES_KEY } from '../lib/roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private roles: Role[];

  constructor(private reflector: Reflector) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    this.roles = requiredRoles;

    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException('You should login first');
    }

    //this.role is contains user.role
    if (this.roles && this.roles.length) {
      const hasRole = () =>
        this.roles.some((role) => user.role?.includes(role));

      if (!hasRole()) {
        throw new ForbiddenException(
          'You are not allowed to access this route',
        );
      }
    }

    return user;
  }
}
