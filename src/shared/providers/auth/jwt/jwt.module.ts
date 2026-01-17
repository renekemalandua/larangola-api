import { Module } from '@nestjs/common';
import {
  JwtModule as NestJwtModule,
  JwtService as NestJwtService,
  JwtSignOptions,
} from '@nestjs/jwt';
import { IJwtService } from '../../../services';
import { JwtService } from './jwt.service';
import { GLOBAL_CONFIG } from '../../../configs';

const jwtSignOptions: JwtSignOptions = {};

if (GLOBAL_CONFIG.jwtAuthExp) {
  const parsed = Number(GLOBAL_CONFIG.jwtAuthExp);
  jwtSignOptions.expiresIn = Number.isNaN(parsed)
    ? (GLOBAL_CONFIG.jwtAuthExp as JwtSignOptions['expiresIn'])
    : parsed;
}

@Module({
  imports: [
    NestJwtModule.register({
      secret: GLOBAL_CONFIG.jwtAuthSecret ?? '',
      signOptions: jwtSignOptions,
    }),
  ],
  providers: [
    NestJwtService,
    {
      provide: IJwtService,
      useClass: JwtService,
    },
  ],
  exports: [IJwtService, NestJwtService],
})
export class JwtModule {}
