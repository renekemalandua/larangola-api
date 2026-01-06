import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('ListingControllerController (e2e)', () => {
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

  describe('POST /api/v1/listings/create', () => {
    it('should create a listing successfully', async () => {
      const createDto = {};
      const mockListing = {
        id: 'listing-id-1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.listing.create.mockResolvedValue(mockListing as any);
      const response = await request(app.getHttpServer())
        .post('/api/v1/listings/create')
        .send(createDto)
        .expect(201);
      expect(response.body.status).toBe(true);
    });
  });

  describe('GET /api/v1/listings/list', () => {
    it('should return list of listings', async () => {
      prisma.listing.findMany.mockResolvedValue([] as any);
      const response = await request(app.getHttpServer())
        .get('/api/v1/listings/list')
        .expect(200);
      expect(response.body.status).toBe(true);
    });
  });
});
