import { BadRequestException, Injectable } from '@nestjs/common';
import { IJwtService } from '../../services';
import { GLOBAL_CONFIG } from '../../configs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: IJwtService) {}

  async auth(id: string, email: string): Promise<string> {
    const payload = { email, sub: id };
    if (!GLOBAL_CONFIG.jwtAuthExp || !GLOBAL_CONFIG.jwtAuthSecret)
      throw new BadRequestException('Undefined .env variables');
    return await this.jwtService.encrypt({
      payload,
      secret: GLOBAL_CONFIG.jwtAuthSecret,
      exp: GLOBAL_CONFIG.jwtAuthExp,
    });
  }

  async verifyToken(token: string): Promise<string> {
    if (!GLOBAL_CONFIG.jwtAuthSecret)
      throw new BadRequestException('Undefined .env variables');
    return await this.jwtService.verify(token, GLOBAL_CONFIG.jwtAuthSecret);
  }
}
