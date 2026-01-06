import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('UserController (e2e)', () => {
	let app: INestApplication;
	let prisma: jest.Mocked<PrismaService>;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(PrismaService)
			.useValue(mockPrismaService)
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
		app.setGlobalPrefix('api/v1');
		await app.init();

		prisma = moduleFixture.get(PrismaService);
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /api/v1/users/create', () => {
		it('should create a user successfully', async () => {
			const createDto = {
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
			};

			const mockUser = {
				id: 'user-id-1',
				...createDto,
				avatar: null,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.user.findFirst.mockResolvedValue(null);
			prisma.user.create.mockResolvedValue(mockUser as any);

			const response = await request(app.getHttpServer())
				.post('/api/v1/users/create')
				.send(createDto)
				.expect(201);

			expect(response.body.status).toBe(true);
			expect(response.body.data).toHaveProperty('id');
			expect(response.body.data.email).toBe(createDto.email);
		});

		it('should return 400 if email already exists', async () => {
			const createDto = {
				email: 'existing@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
			};

			prisma.user.findFirst.mockResolvedValue({ id: 'existing-id' } as any);

			await request(app.getHttpServer())
				.post('/api/v1/users/create')
				.send(createDto)
				.expect(400);
		});

		it('should validate required fields', async () => {
			await request(app.getHttpServer())
				.post('/api/v1/users/create')
				.send({})
				.expect(400);
		});
	});

	describe('GET /api/v1/users/list', () => {
		it('should return list of users', async () => {
			const mockUsers = [
				{
					id: 'user-id-1',
					email: 'user1@example.com',
					phone: '+244912345678',
					name: 'User 1',
					avatar: null,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			prisma.user.findMany.mockResolvedValue(mockUsers as any);

			const response = await request(app.getHttpServer())
				.get('/api/v1/users/list')
				.expect(200);

			expect(response.body.status).toBe(true);
			expect(Array.isArray(response.body.data)).toBe(true);
		});
	});

	describe('GET /api/v1/users/:id', () => {
		it('should return user by id', async () => {
			const mockUser = {
				id: 'user-id-1',
				email: 'test@example.com',
				phone: '+244912345678',
				name: 'Test User',
				avatar: null,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.user.findUnique.mockResolvedValue(mockUser as any);

			const response = await request(app.getHttpServer())
				.get('/api/v1/users/user-id-1')
				.expect(200);

			expect(response.body.status).toBe(true);
			expect(response.body.data.id).toBe('user-id-1');
		});

		it('should return 400 if user not found', async () => {
			prisma.user.findUnique.mockResolvedValue(null);

			await request(app.getHttpServer())
				.get('/api/v1/users/non-existent-id')
				.expect(400);
		});
	});

	describe('PUT /api/v1/users/:id', () => {
		it('should update user successfully', async () => {
			const updateDto = {
				name: 'Updated Name',
				avatar: 'https://example.com/avatar.jpg',
			};

			const existingUser = {
				id: 'user-id-1',
				email: 'test@example.com',
				phone: '+244912345678',
				name: 'Old Name',
				avatar: null,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const updatedUser = {
				...existingUser,
				...updateDto,
				updatedAt: new Date(),
			};

			prisma.user.findUnique
				.mockResolvedValueOnce(existingUser as any)
				.mockResolvedValueOnce(updatedUser as any);
			prisma.user.update.mockResolvedValue(updatedUser as any);

			const response = await request(app.getHttpServer())
				.put('/api/v1/users/user-id-1')
				.send(updateDto)
				.expect(200);

			expect(response.body.status).toBe(true);
			expect(response.body.data.name).toBe(updateDto.name);
		});
	});

	describe('DELETE /api/v1/users/:id', () => {
		it('should delete user successfully', async () => {
			const mockUser = {
				id: 'user-id-1',
				email: 'test@example.com',
				phone: '+244912345678',
				name: 'Test User',
				avatar: null,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.user.findUnique.mockResolvedValue(mockUser as any);
			prisma.user.delete.mockResolvedValue(mockUser as any);

			const response = await request(app.getHttpServer())
				.delete('/api/v1/users/user-id-1')
				.expect(200);

			expect(response.body.status).toBe(true);
		});
	});
});

