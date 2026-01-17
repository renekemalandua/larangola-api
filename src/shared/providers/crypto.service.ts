import { Injectable } from '@nestjs/common';
import { ICryptoService } from '../services';
import { hash, compare } from 'bcrypt';

@Injectable()
export class CryptoService implements ICryptoService {
  async hash(value: string): Promise<string> {
    const salt = 10;
    return hash(value, salt);
  }

  async compare(hash: string, value: string): Promise<boolean> {
    return await compare(value, hash);
  }
}
