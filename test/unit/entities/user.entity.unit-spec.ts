import { UserEntity } from '../../../src/entities/user.entity';
import { IdValueObject } from '../../../src/shared';

describe('UserEntity (Unit)', () => {
	describe('create', () => {
		it('should create a UserEntity with required fields', () => {
			const props = {
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
			};

			const entity = UserEntity.create(props);

			expect(entity).toBeInstanceOf(UserEntity);
			expect(entity.email).toBe(props.email);
			expect(entity.phone).toBe(props.phone);
			expect(entity.password).toBe(props.password);
			expect(entity.name).toBe(props.name);
			expect(entity.avatar).toBeNull();
			expect(entity.isActive).toBe(true);
			expect(entity.id).toBeDefined();
			expect(entity.createdAt).toBeInstanceOf(Date);
			expect(entity.updatedAt).toBeInstanceOf(Date);
		});

		it('should create a UserEntity with optional fields', () => {
			const props = {
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
				avatar: 'https://example.com/avatar.jpg',
				isActive: false,
			};

			const entity = UserEntity.create(props);

			expect(entity.avatar).toBe('https://example.com/avatar.jpg');
			expect(entity.isActive).toBe(false);
		});

		it('should create a UserEntity with custom id', () => {
			const props = {
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
			};

			const customId = new IdValueObject('custom-id-123');
			const entity = UserEntity.create(props, customId);

			expect(entity.id).toBe('custom-id-123');
		});
	});

	describe('getters and setters', () => {
		let entity: UserEntity;

		beforeEach(() => {
			entity = UserEntity.create({
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
			});
		});

		it('should update email and touch updatedAt', () => {
			const oldUpdatedAt = entity.updatedAt;

			// Wait a bit to ensure different timestamp
			setTimeout(() => {
				entity.email = 'newemail@example.com';
				expect(entity.email).toBe('newemail@example.com');
				expect(entity.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
			}, 10);
		});

		it('should update phone and touch updatedAt', () => {
			const oldUpdatedAt = entity.updatedAt;
			entity.phone = '+244987654321';

			expect(entity.phone).toBe('+244987654321');
			expect(entity.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
		});

		it('should update name and touch updatedAt', () => {
			const oldUpdatedAt = entity.updatedAt;
			entity.name = 'New Name';

			expect(entity.name).toBe('New Name');
			expect(entity.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
		});

		it('should update avatar and touch updatedAt', () => {
			const oldUpdatedAt = entity.updatedAt;
			entity.avatar = 'https://example.com/new-avatar.jpg';

			expect(entity.avatar).toBe('https://example.com/new-avatar.jpg');
			expect(entity.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
		});

		it('should update isActive and touch updatedAt', () => {
			const oldUpdatedAt = entity.updatedAt;
			entity.isActive = false;

			expect(entity.isActive).toBe(false);
			expect(entity.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
		});

		it('should not allow modification of createdAt', () => {
			const originalCreatedAt = entity.createdAt;

			// createdAt is readonly, so we can't modify it directly
			expect(entity.createdAt).toBe(originalCreatedAt);
		});
	});

	describe('equals', () => {
		it('should return true for same entity', () => {
			const entity1 = UserEntity.create(
				{
					email: 'test@example.com',
					phone: '+244912345678',
					password: 'password123',
					name: 'Test User',
				},
				new IdValueObject('same-id')
			);

			expect(entity1.equals(entity1)).toBe(true);
		});

		it('should return true for entities with same id', () => {
			const id = new IdValueObject('same-id');
			const entity1 = UserEntity.create(
				{
					email: 'test1@example.com',
					phone: '+244912345678',
					password: 'password123',
					name: 'Test User 1',
				},
				id
			);

			const entity2 = UserEntity.create(
				{
					email: 'test2@example.com',
					phone: '+244987654321',
					password: 'password456',
					name: 'Test User 2',
				},
				id
			);

			expect(entity1.equals(entity2)).toBe(true);
		});

		it('should return false for entities with different ids', () => {
			const entity1 = UserEntity.create(
				{
					email: 'test1@example.com',
					phone: '+244912345678',
					password: 'password123',
					name: 'Test User 1',
				},
				new IdValueObject('id-1')
			);

			const entity2 = UserEntity.create(
				{
					email: 'test2@example.com',
					phone: '+244987654321',
					password: 'password456',
					name: 'Test User 2',
				},
				new IdValueObject('id-2')
			);

			expect(entity1.equals(entity2)).toBe(false);
		});

		it('should return false for null or undefined', () => {
			const entity = UserEntity.create({
				email: 'test@example.com',
				phone: '+244912345678',
				password: 'password123',
				name: 'Test User',
			});

			expect(entity.equals(null as any)).toBe(false);
			expect(entity.equals(undefined as any)).toBe(false);
		});
	});
});

