import { BadRequestException } from '@nestjs/common';
import {
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  ListUsersUseCase,
  FindUserByIdUseCase,
  FindUserByEmailUseCase,
} from '../../../src/usecases/user.usecases';
import { IUserRepository } from '../../../src/repositories/IUserRepository';
import { UserEntity } from '../../../src/entities/user.entity';
import { IdValueObject } from '../../../src/shared';

describe('User Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IUserRepository>;
  let createUseCase: CreateUserUseCase;
  let updateUseCase: UpdateUserUseCase;
  let deleteUseCase: DeleteUserUseCase;
  let listUseCase: ListUsersUseCase;
  let findByIdUseCase: FindUserByIdUseCase;
  let findByEmailUseCase: FindUserByEmailUseCase;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    createUseCase = new CreateUserUseCase(mockRepository);
    updateUseCase = new UpdateUserUseCase(mockRepository);
    deleteUseCase = new DeleteUserUseCase(mockRepository);
    listUseCase = new ListUsersUseCase(mockRepository);
    findByIdUseCase = new FindUserByIdUseCase(mockRepository);
    findByEmailUseCase = new FindUserByEmailUseCase(mockRepository);
  });

  describe('CreateUserUseCase', () => {
    it('should create a user successfully', async () => {
      const request = {
        email: 'test@example.com',
        phone: '+244912345678',
        password: 'password123',
        name: 'Test User',
      };

      const mockEntity = UserEntity.create(
        request,
        new IdValueObject('user-id-1')
      );

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findByPhone.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockEntity);

      const result = await createUseCase.execute(request);

      expect(result).toBeDefined();
      expect(result.email).toBe(request.email);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error if email already exists', async () => {
      const request = {
        email: 'existing@example.com',
        phone: '+244912345678',
        password: 'password123',
        name: 'Test User',
      };

      const existingUser = UserEntity.create(
        request,
        new IdValueObject('existing-id')
      );

      mockRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(createUseCase.execute(request)).rejects.toThrow(
        BadRequestException
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error if phone already exists', async () => {
      const request = {
        email: 'test@example.com',
        phone: '+244912345678',
        password: 'password123',
        name: 'Test User',
      };

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findByPhone.mockResolvedValue(
        UserEntity.create(request, new IdValueObject('existing-id'))
      );

      await expect(createUseCase.execute(request)).rejects.toThrow(
        BadRequestException
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('UpdateUserUseCase', () => {
    it('should update user successfully', async () => {
      const existingUser = UserEntity.create(
        {
          email: 'test@example.com',
          phone: '+244912345678',
          password: 'password123',
          name: 'Old Name',
        },
        new IdValueObject('user-id-1')
      );

      const updateData = { name: 'New Name' };

      mockRepository.findById.mockResolvedValue(existingUser);
      mockRepository.update.mockResolvedValue(
        UserEntity.create(
          { ...existingUser, name: 'New Name' } as any,
          new IdValueObject('user-id-1')
        )
      );

      const result = await updateUseCase.execute({
        id: 'user-id-1',
        data: updateData,
      });

      expect(result.name).toBe('New Name');
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw error if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        updateUseCase.execute({
          id: 'non-existent',
          data: { name: 'New Name' },
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('DeleteUserUseCase', () => {
    it('should delete user successfully', async () => {
      const existingUser = UserEntity.create(
        {
          email: 'test@example.com',
          phone: '+244912345678',
          password: 'password123',
          name: 'Test User',
        },
        new IdValueObject('user-id-1')
      );

      mockRepository.findById.mockResolvedValue(existingUser);
      mockRepository.delete.mockResolvedValue(undefined);

      await deleteUseCase.execute('user-id-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('user-id-1');
    });

    it('should throw error if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(deleteUseCase.execute('non-existent')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('ListUsersUseCase', () => {
    it('should return list of users', async () => {
      const users = [
        UserEntity.create(
          {
            email: 'user1@example.com',
            phone: '+244912345678',
            password: 'password123',
            name: 'User 1',
          },
          new IdValueObject('user-id-1')
        ),
      ];

      mockRepository.list.mockResolvedValue(users);

      const result = await listUseCase.execute();

      expect(result).toEqual(users);
      expect(mockRepository.list).toHaveBeenCalledTimes(1);
    });
  });

  describe('FindUserByIdUseCase', () => {
    it('should return user by id', async () => {
      const user = UserEntity.create(
        {
          email: 'test@example.com',
          phone: '+244912345678',
          password: 'password123',
          name: 'Test User',
        },
        new IdValueObject('user-id-1')
      );

      mockRepository.findById.mockResolvedValue(user);

      const result = await findByIdUseCase.execute('user-id-1');

      expect(result).toEqual(user);
      expect(mockRepository.findById).toHaveBeenCalledWith('user-id-1');
    });

    it('should throw error if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(findByIdUseCase.execute('non-existent')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('FindUserByEmailUseCase', () => {
    it('should return user by email', async () => {
      const user = UserEntity.create(
        {
          email: 'test@example.com',
          phone: '+244912345678',
          password: 'password123',
          name: 'Test User',
        },
        new IdValueObject('user-id-1')
      );

      mockRepository.findByEmail.mockResolvedValue(user);

      const result = await findByEmailUseCase.execute('test@example.com');

      expect(result).toEqual(user);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
    });

    it('should throw error if user not found', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      await expect(
        findByEmailUseCase.execute('notfound@example.com')
      ).rejects.toThrow(BadRequestException);
    });
  });
});
