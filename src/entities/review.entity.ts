import { AggregateRoot, IdValueObject, Optional } from '../shared';

interface IReviewProps {
	listingId: string | null;
	fromUserId: string;
	toUserId: string;
	rating: number;
	comment: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export class ReviewEntity extends AggregateRoot<IReviewProps> {
	static create(
		props: Optional<IReviewProps, 'listingId' | 'comment' | 'createdAt' | 'updatedAt'>,
		id?: IdValueObject,
	) {
		return new ReviewEntity(
			{
				listingId: props.listingId ?? null,
				fromUserId: props.fromUserId,
				toUserId: props.toUserId,
				rating: props.rating,
				comment: props.comment ?? null,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		);
	}

	protected touch(): void {
		this.props.updatedAt = new Date();
	}

	public get listingId(): string | null {
		return this.props.listingId;
	}
	public set listingId(v: string | null) {
		this.props.listingId = v;
		this.touch();
	}
	public get fromUserId(): string {
		return this.props.fromUserId;
	}
	public get toUserId(): string {
		return this.props.toUserId;
	}
	public get rating(): number {
		return this.props.rating;
	}
	public set rating(v: number) {
		this.props.rating = v;
		this.touch();
	}
	public get comment(): string | null {
		return this.props.comment;
	}
	public set comment(v: string | null) {
		this.props.comment = v;
		this.touch();
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
	public get updatedAt(): Date {
		return this.props.updatedAt;
	}
}

