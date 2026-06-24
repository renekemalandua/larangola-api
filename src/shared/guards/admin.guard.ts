import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { IJwtService } from '../services';
import { GLOBAL_CONFIG } from '../configs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: IJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);

    try {
      const decoded = await this.jwtService.verify(
        token,
        GLOBAL_CONFIG.jwtAuthSecret!
      );

      const payload = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;

      // Check if user is admin or auditor
      if (payload.adminRole !== 'ADMIN' && payload.adminRole !== 'AUDITOR') {
        throw new ForbiddenException('Admin or Auditor access required');
      }

      // Attach admin info to request
      request.user = {
        id: payload.id || payload.sub,
        email: payload.email,
        role: payload.role,
        ...payload,
      };

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
