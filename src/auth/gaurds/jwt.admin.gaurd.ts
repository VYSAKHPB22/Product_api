import { ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('Access denied. Admins only.');
    }

    return user;
  }
}
