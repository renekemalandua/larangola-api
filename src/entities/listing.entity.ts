import { AggregateRoot, IdValueObject, Optional } from '../shared';

export enum ListingType {
	rent = 'rent',
	buy = 'buy',
}

export enum ListingStatus {
	draft = 'draft',
	published = 'published',
	finished = 'finished',
}

interface IListingProps {
	propertyId: string;
	ownerId: string;
	listingType: ListingType;
	price: number;
	currency: string;
	status: ListingStatus;
	listedBy: string;
	agentId: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export class ListingEntity extends AggregateRoot<IListingProps> {
	static create(
		props: Optional<IListingProps, 'currency' | 'status' | 'agentId' | 'createdAt' | 'updatedAt'>,
		id?: IdValueObject,
	) {
		return new ListingEntity(
			{
				propertyId: props.propertyId,
				ownerId: props.ownerId,
				listingType: props.listingType,
				price: props.price,
				currency: props.currency ?? 'AOA',
				status: props.status ?? ListingStatus.draft,
				listedBy: props.listedBy,
				agentId: props.agentId ?? null,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		);
	}

	protected touch(): void {
		this.props.updatedAt = new Date();
	}

	public get propertyId(): string {
		return this.props.propertyId;
	}
	public get ownerId(): string {
		return this.props.ownerId;
	}
	public get listingType(): ListingType {
		return this.props.listingType;
	}
	public set listingType(v: ListingType) {
		this.props.listingType = v;
		this.touch();
	}
	public get price(): number {
		return this.props.price;
	}
	public set price(v: number) {
		this.props.price = v;
		this.touch();
	}
	public get currency(): string {
		return this.props.currency;
	}
	public set currency(v: string) {
		this.props.currency = v;
		this.touch();
	}
	public get status(): ListingStatus {
		return this.props.status;
	}
	public set status(v: ListingStatus) {
		this.props.status = v;
		this.touch();
	}
	public get listedBy(): string {
		return this.props.listedBy;
	}
	public set listedBy(v: string) {
		this.props.listedBy = v;
		this.touch();
	}
	public get agentId(): string | null {
		return this.props.agentId;
	}
	public set agentId(v: string | null) {
		this.props.agentId = v;
		this.touch();
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
	public get updatedAt(): Date {
		return this.props.updatedAt;
	}
}

