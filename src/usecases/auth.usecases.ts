import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IJwtService, ICryptoService, UseCase, GLOBAL_CONFIG } from '../shared';
import { AuthLoginDTO, AuthRegisterDTO } from '../dto/auth.dto';
import { IUserRepository } from '../repositories/IUserRepository';
import { UserEntity } from '../entities/user.entity';
import { EmailService } from '../shared/providers/email';

@Injectable()
export class AuthLoginUseCase implements UseCase<
  { ipAddress: string; data: AuthLoginDTO },
  any
> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly cryptoService: ICryptoService
  ) {}

  async execute(request: { ipAddress: string; data: AuthLoginDTO }) {
    const user = await this.repository.findByEmail(request.data.email);
    if (!user) throw new BadRequestException('Email or password dont match');

    const matchPassword = await this.cryptoService.compare(
      user.password,
      request.data.password
    );
    if (!matchPassword)
      throw new BadRequestException('Email or password dont match');

    if (!user.isActive)
      throw new UnauthorizedException('User account is deactivated');

    const payload = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
      adminRole: user.adminRole,
      role: user.adminRole !== 'NONE' ? 'ADMIN' : 'USER',
    };

    if (!GLOBAL_CONFIG.jwtAuthExp || !GLOBAL_CONFIG.jwtAuthSecret)
      throw new BadRequestException('Undefined .env variables');

    const token = await this.jwtService.encrypt({
      payload,
      secret: GLOBAL_CONFIG.jwtAuthSecret,
      exp: GLOBAL_CONFIG.jwtAuthExp,
    });

    return { token, user };
  }
}

@Injectable()
export class AuthRegisterUseCase implements UseCase<
  AuthRegisterDTO,
  { token: string; user: UserEntity }
> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly cryptoService: ICryptoService,
    private readonly emailService: EmailService
  ) {}

  async execute(request: AuthRegisterDTO) {
    // Verificar se email já existe
    const existingEmail = await this.repository.findByEmail(request.email);
    if (existingEmail) throw new BadRequestException('Email already exists');

    // Verificar se telefone já existe
    const existingPhone = await this.repository.findByPhone(request.phone);
    if (existingPhone) throw new BadRequestException('Phone already exists');

    // Hash da senha
    const hashedPassword = await this.cryptoService.hash(request.password);

    // Criar entidade
    const entity = UserEntity.create({
      email: request.email,
      phone: request.phone,
      password: hashedPassword,
      name: request.name,
    });

    // Salvar no banco
    const user = await this.repository.create(entity);

    // Gerar token
    const payload = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
      adminRole: user.adminRole,
      role: user.adminRole !== 'NONE' ? 'ADMIN' : 'USER',
    };

    if (!GLOBAL_CONFIG.jwtAuthExp || !GLOBAL_CONFIG.jwtAuthSecret)
      throw new BadRequestException('Undefined .env variables');

    const token = await this.jwtService.encrypt({
      payload,
      secret: GLOBAL_CONFIG.jwtAuthSecret,
      exp: GLOBAL_CONFIG.jwtAuthExp,
    });

    // Send welcome email asynchronously
    this.emailService.sendWelcome(user.email, user.name).catch(console.error);

    return { token, user };
  }
}

@Injectable()
export class AuthForgotPasswordUseCase implements UseCase<string, { message: string }> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly emailService: EmailService
  ) {}

  async execute(email: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return { message: 'If an account exists, an email has been sent.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetOtpCode = otp;
    user.resetOtpExpiresAt = expiresAt;
    
    await this.repository.update(user);

    await this.emailService.sendPasswordResetOtp(user.email, user.name, otp);

    return { message: 'If an account exists, an email has been sent.' };
  }
}

@Injectable()
export class AuthVerifyOtpUseCase implements UseCase<{ email: string; otp: string }, { valid: boolean }> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(request: { email: string; otp: string }) {
    const user = await this.repository.findByEmail(request.email);
    if (!user) throw new BadRequestException('Invalid OTP or Email');

    if (user.resetOtpCode !== request.otp || !user.resetOtpExpiresAt) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.resetOtpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    return { valid: true };
  }
}

@Injectable()
export class AuthResetPasswordUseCase implements UseCase<any, { message: string }> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly cryptoService: ICryptoService
  ) {}

  async execute(request: any) {
    const user = await this.repository.findByEmail(request.email);
    if (!user) throw new BadRequestException('Invalid OTP or Email');

    if (user.resetOtpCode !== request.otp || !user.resetOtpExpiresAt) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.resetOtpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    const hashedPassword = await this.cryptoService.hash(request.newPassword);
    
    user.password = hashedPassword;
    user.resetOtpCode = null;
    user.resetOtpExpiresAt = null;

    await this.repository.update(user);

    return { message: 'Password reset successfully' };
  }
}
