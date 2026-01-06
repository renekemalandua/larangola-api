import { UserAdapter } from '../../../src/adapters/user.adapter';
import { UserEntity } from '../../../src/entities/user.entity';
import { IdValueObject } from '../../../src/shared';

describe('UserAdapter (Unit)', () => {
  describe('toDomain', () => {
    it('should convert Prisma User to UserEntity', () => {
      const prismaUser = {
        id: 'user-id-1',
        email: 'test@example.com',
        phone: '+244912345678',
        password: 'password123',
        name: 'Test User',
        avatar: null,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const entity = UserAdapter.toDomain(prismaUser as any);

      expect(entity).toBeInstanceOf(UserEntity);
      expect(entity.id).toBe('user-id-1');
      expect(entity.email).toBe('test@example.com');
      expect(entity.phone).toBe('+244912345678');
      expect(entity.name).toBe('Test User');
    });

    it('should handle null avatar correctly', () => {
      const prismaUser = {
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

      const entity = UserAdapter.toDomain(prismaUser as any);

      expect(entity.avatar).toBeNull();
    });
  });

  describe('toPrisma', () => {
    it('should convert UserEntity to Prisma User', () => {
      const entity = UserEntity.create(
        {
          email: 'test@example.com',
          phone: '+244912345678',
          password: 'password123',
          name: 'Test User',
          avatar: null,
        },
        new IdValueObject('user-id-1')
      );

      const prismaUser = UserAdapter.toPrisma(entity);

      expect(prismaUser).toHaveProperty('id', 'user-id-1');
      expect(prismaUser).toHaveProperty('email', 'test@example.com');
      expect(prismaUser).toHaveProperty('phone', '+244912345678');
      expect(prismaUser).toHaveProperty('name', 'Test User');
      expect(prismaUser).toHaveProperty('password', 'password123');
      expect(prismaUser).toHaveProperty('avatar', null);
      expect(prismaUser).toHaveProperty('isActive', true);
    });
  });

  describe('toHttp', () => {
    it('should convert UserEntity to HTTP response format', () => {
      const entity = UserEntity.create(
        {
          email: 'test@example.com',
          phone: '+244912345678',
          password: 'password123',
          name: 'Test User',
          avatar: 'https://example.com/avatar.jpg',
        },
        new IdValueObject('user-id-1')
      );

      const httpResponse = UserAdapter.toHttp(entity);

      expect(httpResponse).toHaveProperty('id', 'user-id-1');
      expect(httpResponse).toHaveProperty('email', 'test@example.com');
      expect(httpResponse).toHaveProperty('phone', '+244912345678');
      expect(httpResponse).toHaveProperty('name', 'Test User');
      expect(httpResponse).toHaveProperty(
        'avatar',
        'https://example.com/avatar.jpg'
      );
      expect(httpResponse).not.toHaveProperty('password'); // Password should not be in HTTP response
    });
  });
});
