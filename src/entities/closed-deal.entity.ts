import { AggregateRoot, IdValueObject, Optional } from '../shared';

export enum ClosedDealStatus {
	completed = 'completed',
	pending_payment = 'pending_payment',
}

interface IClosedDealProps {
	listingId: string;
	agentId: string;
	clientId: string;
	commissionAmount: number;
	commissionRate: number;
	status: ClosedDealStatus;
	closedDate: Date;
	createdAt: Date;
	updatedAt: Date;
}

export class ClosedDealEntity extends AggregateRoot<IClosedDealProps> {
	static create(
		props: Optional<IClosedDealProps, 'status' | 'createdAt' | 'updatedAt'>,
		id?: IdValueObject,
	) {
		return new ClosedDealEntity(
			{
				listingId: props.listingId,
				agentId: props.agentId,
				clientId: props.clientId,
				commissionAmount: props.commissionAmount,
				commissionRate: props.commissionRate,
				status: props.status ?? ClosedDealStatus.pending_payment,
				closedDate: props.closedDate,
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
	public get agentId(): string {
		return this.props.agentId;
	}
	public get clientId(): string {
		return this.props.clientId;
	}
	public get commissionAmount(): number {
		return this.props.commissionAmount;
	}
	public set commissionAmount(v: number) {
		this.props.commissionAmount = v;
		this.touch();
	}
	public get commissionRate(): number {
		return this.props.commissionRate;
	}
	public set commissionRate(v: number) {
		this.props.commissionRate = v;
		this.touch();
	}
	public get status(): ClosedDealStatus {
		return this.props.status;
	}
	public set status(v: ClosedDealStatus) {
		this.props.status = v;
		this.touch();
	}
	public get closedDate(): Date {
		return this.props.closedDate;
	}
	public set closedDate(v: Date) {
		this.props.closedDate = v;
		this.touch();
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
	public get updatedAt(): Date {
		return this.props.updatedAt;
	}
}


