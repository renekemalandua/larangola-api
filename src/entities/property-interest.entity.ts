import { AggregateRoot, IdValueObject, Optional } from '../shared';

interface IPropertyInterestProps {
	listingId: string;
	userId: string;
	message: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export class PropertyInterestEntity extends AggregateRoot<IPropertyInterestProps> {
	static create(
		props: Optional<IPropertyInterestProps, 'message' | 'createdAt' | 'updatedAt'>,
		id?: IdValueObject,
	) {
		return new PropertyInterestEntity(
			{
				listingId: props.listingId,
				userId: props.userId,
				message: props.message ?? null,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		);
	}

	protected touch(): void {
		this.props.updatedAt = new Date();
	}

	public get listingId(): string {
		return this.props.listingId;
	}
	public get userId(): string {
		return this.props.userId;
	}
	public get message(): string | null {
		return this.props.message;
	}
	public set message(v: string | null) {
		this.props.message = v;
		this.touch();
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
	public get updatedAt(): Date {
		return this.props.updatedAt;
	}
}

