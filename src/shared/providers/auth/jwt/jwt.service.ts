import { JwtService as NestJwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IJwtProps, IJwtService } from '../../../services';

@Injectable()
export class JwtService implements IJwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async encrypt(data: IJwtProps): Promise<string> {
    return await this.jwtService.sign(data.payload, { secret: data.secret });
  }
  async verify(token: string, secret: string): Promise<string> {
    const decoded = await this.jwtService.verify(token, { secret });
    if (typeof decoded !== 'object' || decoded === null) {
      throw new BadRequestException('invalid decoded token format');
    }
    const payload: string = decoded.payload;
    return payload;
  }
}
