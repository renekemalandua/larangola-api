import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase, ICryptoService } from '../shared';
import { UserEntity } from '../entities/user.entity';
import { IUserRepository } from '../repositories/IUserRepository';
import { CreateUserRequestDTO, UpdateUserRequestDTO } from '../dto/user.dto';

@Injectable()
export class CreateUserUseCase implements UseCase<
  CreateUserRequestDTO,
  UserEntity
> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly cryptoService: ICryptoService
  ) {}
  async execute(request: CreateUserRequestDTO): Promise<UserEntity> {
    const existingEmail = await this.repository.findByEmail(request.email);
    if (existingEmail) throw new BadRequestException('Email already exists');
    const existingPhone = await this.repository.findByPhone(request.phone);
    if (existingPhone) throw new BadRequestException('Phone already exists');

    // Hash da senha
    const hashPassword = await this.cryptoService.hash(request.password);

    const entity = UserEntity.create({
      ...request,
      password: hashPassword,
    });
    return this.repository.create(entity);
  }
}

@Injectable()
export class UpdateUserUseCase implements UseCase<
  { id: string; data: UpdateUserRequestDTO },
  UserEntity
> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly cryptoService: ICryptoService
  ) {}
  async execute({
    id,
    data,
  }: {
    id: string;
    data: UpdateUserRequestDTO;
  }): Promise<UserEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('User not found');
    if (data.email !== undefined) {
      const existing = await this.repository.findByEmail(data.email);
      if (existing && existing.id !== id)
        throw new BadRequestException('Email already exists');
      entity.email = data.email;
    }
    if (data.phone !== undefined) {
      const existing = await this.repository.findByPhone(data.phone);
      if (existing && existing.id !== id)
        throw new BadRequestException('Phone already exists');
      entity.phone = data.phone;
    }
    if (data.password !== undefined) {
      // Hash da senha ao atualizar
      const hashPassword = await this.cryptoService.hash(data.password);
      entity.password = hashPassword;
    }
    if (data.name !== undefined) entity.name = data.name;
    if (data.avatar !== undefined) entity.avatar = data.avatar ?? null;
    if (data.isActive !== undefined) entity.isActive = data.isActive;
    return this.repository.update(entity);
  }
}

@Injectable()
export class DeleteUserUseCase implements UseCase<string, void> {
  constructor(private readonly repository: IUserRepository) {}
  async execute(id: string): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('User not found');
    await this.repository.delete(id);
  }
}

@Injectable()
export class ListUsersUseCase implements UseCase<void, UserEntity[]> {
  constructor(private readonly repository: IUserRepository) {}
  async execute(): Promise<UserEntity[]> {
    return this.repository.list();
  }
}

@Injectable()
export class FindUserByIdUseCase implements UseCase<string, UserEntity | null> {
  constructor(private readonly repository: IUserRepository) {}
  async execute(id: string): Promise<UserEntity | null> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('User not found');
    return entity;
  }
}

@Injectable()
export class FindUserByEmailUseCase implements UseCase<
  string,
  UserEntity | null
> {
  constructor(private readonly repository: IUserRepository) {}
  async execute(email: string): Promise<UserEntity | null> {
    const entity = await this.repository.findByEmail(email);
    if (!entity) throw new BadRequestException('User not found');
    return entity;
  }
}
