import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IJwtService, ICryptoService, UseCase, GLOBAL_CONFIG } from '../shared';
import { AuthLoginDTO, AuthRegisterDTO } from '../dto/auth.dto';
import { IUserRepository } from '../repositories/IUserRepository';
import { UserEntity } from '../entities/user.entity';

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
    private readonly cryptoService: ICryptoService
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
