import { NotFoundException } from '@nestjs/common';
import { PrismaUserRepository } from '../../../src/repositories/implementation/PrismaUserRepository';
import { PrismaService } from '../../../src/shared';
import { UserEntity } from '../../../src/entities/user.entity';
import { IdValueObject } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaUserRepository (Unit)', () => {
	let repository: PrismaUserRepository;
	let prisma: typeof mockPrismaService;

	beforeEach(() => {
		prisma = { ...mockPrismaService };
		repository = new PrismaUserRepository(prisma as any);
		jest.clearAllMocks();
	});

	describe('create', () => {
		it('should create a user successfully', async () => {
			const entity = UserEntity.create(
				{
					email: 'test@example.com',
					phone: '+244912345678',
					password: 'password123',
					name: 'Test User',
				},
				new IdValueObject('user-id-1')
			);

			const mockPrismaUser = {
				id: 'user-id-1',
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
				avatar: null,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.user.create.mockResolvedValue(mockPrismaUser as any);

			const result = await repository.create(entity);

			expect(result).toBeInstanceOf(UserEntity);
			expect(result.id).toBe('user-id-1');
			expect(prisma.user.create).toHaveBeenCalledTimes(1);
		});
	});

	describe('list', () => {
		it('should return list of users', async () => {
			const mockUsers = [
				{
					id: 'user-id-1',
					email: 'user1@example.com',
					phone: '+244912345678',
					password: 'password123',
					name: 'User 1',
					avatar: null,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			prisma.user.findMany.mockResolvedValue(mockUsers as any);

			const result = await repository.list();

			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toBeInstanceOf(UserEntity);
			expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
		});
	});

	describe('findById', () => {
		it('should return user by id', async () => {
			const mockUser = {
				id: 'user-id-1',
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
				avatar: null,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.user.findUnique.mockResolvedValue(mockUser as any);

			const result = await repository.findById('user-id-1');

			expect(result).toBeInstanceOf(UserEntity);
			expect(result?.id).toBe('user-id-1');
			expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user-id-1' } });
		});

		it('should return null if user not found', async () => {
			prisma.user.findUnique.mockResolvedValue(null);

			const result = await repository.findById('non-existent');

			expect(result).toBeNull();
		});
	});

	describe('findByEmail', () => {
		it('should return user by email', async () => {
			const mockUser = {
				id: 'user-id-1',
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
				avatar: null,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.user.findUnique.mockResolvedValue(mockUser as any);

			const result = await repository.findByEmail('test@example.com');

			expect(result).toBeInstanceOf(UserEntity);
			expect(result?.email).toBe('test@example.com');
		});
	});

	describe('update', () => {
		it('should update user successfully', async () => {
			const entity = UserEntity.create(
				{
					email: 'test@example.com',
					phone: '+244912345678',
					password: 'password123',
					name: 'Updated Name',
				},
				new IdValueObject('user-id-1')
			);

			const existingUser = {
				id: 'user-id-1',
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Old Name',
				avatar: null,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const updatedUser = {
				...existingUser,
				name: 'Updated Name',
				updatedAt: new Date(),
			};

			prisma.user.findUnique
				.mockResolvedValueOnce(existingUser as any)
				.mockResolvedValueOnce(updatedUser as any);
			prisma.user.update.mockResolvedValue(updatedUser as any);

			const result = await repository.update(entity);

			expect(result).toBeInstanceOf(UserEntity);
			expect(prisma.user.update).toHaveBeenCalledTimes(1);
		});

		it('should throw NotFoundException if user not found', async () => {
			const entity = UserEntity.create(
				{
					email: 'test@example.com',
					phone: '+244912345678',
					password: 'password123',
					name: 'Test User',
				},
				new IdValueObject('non-existent')
			);

			prisma.user.findUnique.mockResolvedValue(null);

			await expect(repository.update(entity)).rejects.toThrow(NotFoundException);
		});
	});

	describe('delete', () => {
		it('should delete user successfully', async () => {
			const existingUser = {
				id: 'user-id-1',
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
				avatar: null,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.user.findUnique.mockResolvedValue(existingUser as any);
			prisma.user.delete.mockResolvedValue(existingUser as any);

			await repository.delete('user-id-1');

			expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user-id-1' } });
		});

		it('should throw NotFoundException if user not found', async () => {
			prisma.user.findUnique.mockResolvedValue(null);

			await expect(repository.delete('non-existent')).rejects.toThrow(NotFoundException);
		});
	});
});

