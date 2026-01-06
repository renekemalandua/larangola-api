import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from './jwt';
import { IJwtService } from '../../services';

@Module({
  imports: [JwtModule],
  providers: [
    AuthService,
    {
      provide: IJwtService,
      useClass: JwtService,
    },
  ],
  exports: [AuthService, IJwtService],
})
export class AuthModule {}
