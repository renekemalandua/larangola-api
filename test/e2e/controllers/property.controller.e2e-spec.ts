import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PropertyController (e2e)', () => {
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

	describe('POST /api/v1/properties/create', () => {
		it('should create a property successfully', async () => {
			const createDto = {
				ownerId: 'owner-id-1',
				categoryId: 'cat-id-1',
				title: 'T3 no Talatona',
				description: 'Apartamento T3 com 2 suítes',
				propertyType: 'apartment',
			};

			const mockCategory = {
				id: 'cat-id-1',
				name: 'Apartamento',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const mockProperty = {
				id: 'prop-id-1',
				...createDto,
				address: null,
				city: null,
				state: null,
				country: 'Angola',
				latitude: null,
				longitude: null,
				bedrooms: null,
				bathrooms: null,
				area: null,
				amenities: null,
				images: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.propertyCategory.findUnique.mockResolvedValue(mockCategory as any);
			prisma.property.create.mockResolvedValue(mockProperty as any);

			const response = await request(app.getHttpServer())
				.post('/api/v1/properties/create')
				.send(createDto)
				.expect(201);

			expect(response.body.status).toBe(true);
			expect(response.body.data).toHaveProperty('id');
		});

		it('should return 400 if category does not exist', async () => {
			const createDto = {
				ownerId: 'owner-id-1',
				categoryId: 'non-existent',
				title: 'T3 no Talatona',
				propertyType: 'apartment',
			};

			prisma.propertyCategory.findUnique.mockResolvedValue(null);

			await request(app.getHttpServer())
				.post('/api/v1/properties/create')
				.send(createDto)
				.expect(400);
		});
	});

	describe('GET /api/v1/properties/list', () => {
		it('should return list of properties', async () => {
			const mockProperties = [
				{
					id: 'prop-id-1',
					ownerId: 'owner-id-1',
					categoryId: 'cat-id-1',
					title: 'T3 no Talatona',
					propertyType: 'apartment',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			prisma.property.findMany.mockResolvedValue(mockProperties as any);

			const response = await request(app.getHttpServer())
				.get('/api/v1/properties/list')
				.expect(200);

			expect(response.body.status).toBe(true);
			expect(Array.isArray(response.body.data)).toBe(true);
		});
	});

	describe('GET /api/v1/properties/:id', () => {
		it('should return property by id', async () => {
			const mockProperty = {
				id: 'prop-id-1',
				ownerId: 'owner-id-1',
				categoryId: 'cat-id-1',
				title: 'T3 no Talatona',
				propertyType: 'apartment',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			prisma.property.findUnique.mockResolvedValue(mockProperty as any);

			const response = await request(app.getHttpServer())
				.get('/api/v1/properties/prop-id-1')
				.expect(200);

			expect(response.body.status).toBe(true);
			expect(response.body.data.id).toBe('prop-id-1');
		});
	});
});

