import { JwtService as NestJwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IJwtProps, IJwtService } from '../../../services';

@Injectable()
export class JwtService implements IJwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async encrypt(data: IJwtProps): Promise<string> {
    return await this.jwtService.sign(data.payload, { secret: data.secret });
  }
  async verify(token: string, secret: string): Promise<any> {
    const decoded = await this.jwtService.verify(token, { secret });
    if (typeof decoded !== 'object' || decoded === null) {
      throw new BadRequestException('invalid decoded token format');
    }
    // The token payload fields are at the root level (not nested under .payload)
    // Return the full decoded object so guards can access id, email, role, etc.
    return decoded;
  }
}
