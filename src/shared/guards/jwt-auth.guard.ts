import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IJwtService } from '../services';
import { GLOBAL_CONFIG } from '../configs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
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
      
      // Parse se for string, ou use direto se for objeto
      const payload = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
      
      // Attach user info to request
      request.user = {
        id: payload.id || payload.sub,
        email: payload.email,
        ...payload,
      };
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
