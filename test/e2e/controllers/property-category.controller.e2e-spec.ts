import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PropertyCategoryController (e2e)', () => {
	let app: INestApplication;
	let prisma: typeof mockPrismaService;

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

	describe('POST /api/v1/property-categories/create', () => {
		it('should create a property category successfully', async () => {
			const createDto = {
				name: 'Apartamento',
				description: 'Categoria para apartamentos',
			};

			const mockCategory = {
				id: 'cat-id-1',
				...createDto,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.propertyCategory.create.mockResolvedValue(mockCategory as any);

			const response = await request(app.getHttpServer())
				.post('/api/v1/property-categories/create')
				.send(createDto)
				.expect(201);

			expect(response.body.status).toBe(true);
			expect(response.body.data).toHaveProperty('id');
			expect(response.body.data.name).toBe(createDto.name);
		});

		it('should validate required fields', async () => {
			await request(app.getHttpServer())
				.post('/api/v1/property-categories/create')
				.send({})
				.expect(400);
		});
	});

	describe('GET /api/v1/property-categories/list', () => {
		it('should return list of property categories', async () => {
			const mockCategories = [
				{
					id: 'cat-id-1',
					name: 'Apartamento',
					description: 'Categoria para apartamentos',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			prisma.propertyCategory.findMany.mockResolvedValue(mockCategories as any);

			const response = await request(app.getHttpServer())
				.get('/api/v1/property-categories/list')
				.expect(200);

			expect(response.body.status).toBe(true);
			expect(Array.isArray(response.body.data)).toBe(true);
		});
	});

	describe('GET /api/v1/property-categories/:id', () => {
		it('should return property category by id', async () => {
			const mockCategory = {
				id: 'cat-id-1',
				name: 'Apartamento',
				description: 'Categoria para apartamentos',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.propertyCategory.findUnique.mockResolvedValue(mockCategory as any);

			const response = await request(app.getHttpServer())
				.get('/api/v1/property-categories/cat-id-1')
				.expect(200);

			expect(response.body.status).toBe(true);
			expect(response.body.data.id).toBe('cat-id-1');
		});
	});

	describe('PUT /api/v1/property-categories/:id', () => {
		it('should update property category successfully', async () => {
			const updateDto = {
				name: 'Updated Category',
				description: 'Updated description',
			};

			const existingCategory = {
				id: 'cat-id-1',
				name: 'Old Category',
				description: 'Old description',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const updatedCategory = {
				...existingCategory,
				...updateDto,
				updatedAt: new Date(),
			};

			prisma.propertyCategory.findUnique
				.mockResolvedValueOnce(existingCategory as any)
				.mockResolvedValueOnce(updatedCategory as any);
			prisma.propertyCategory.update.mockResolvedValue(updatedCategory as any);

			const response = await request(app.getHttpServer())
				.put('/api/v1/property-categories/cat-id-1')
				.send(updateDto)
				.expect(200);

			expect(response.body.status).toBe(true);
			expect(response.body.data.name).toBe(updateDto.name);
		});
	});

	describe('DELETE /api/v1/property-categories/:id', () => {
		it('should delete property category successfully', async () => {
			const mockCategory = {
				id: 'cat-id-1',
				name: 'Apartamento',
				description: 'Categoria para apartamentos',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.propertyCategory.findUnique.mockResolvedValue(mockCategory as any);
			prisma.propertyCategory.delete.mockResolvedValue(mockCategory as any);

			const response = await request(app.getHttpServer())
				.delete('/api/v1/property-categories/cat-id-1')
				.expect(200);

			expect(response.body.status).toBe(true);
		});
	});
});

