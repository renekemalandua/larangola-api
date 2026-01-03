import { AggregateRoot, IdValueObject, Optional } from '../shared';

export enum SubscriptionStatus {
	active = 'active',
	cancelled = 'cancelled',
	expired = 'expired',
}

interface IAgentSubscriptionProps {
	agentId: string;
	planId: string;
	status: SubscriptionStatus;
	startDate: Date;
	endDate: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export class AgentSubscriptionEntity extends AggregateRoot<IAgentSubscriptionProps> {
	static create(
		props: Optional<IAgentSubscriptionProps, 'status' | 'endDate' | 'createdAt' | 'updatedAt'>,
		id?: IdValueObject,
	) {
		return new AgentSubscriptionEntity(
			{
				agentId: props.agentId,
				planId: props.planId,
				status: props.status ?? SubscriptionStatus.active,
				startDate: props.startDate,
				endDate: props.endDate ?? null,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		);
	}

	protected touch(): void {
		this.props.updatedAt = new Date();
	}

	public get agentId(): string {
		return this.props.agentId;
	}
	public get planId(): string {
		return this.props.planId;
	}
	public get status(): SubscriptionStatus {
		return this.props.status;
	}
	public set status(v: SubscriptionStatus) {
		this.props.status = v;
		this.touch();
	}
	public get startDate(): Date {
		return this.props.startDate;
	}
	public set startDate(v: Date) {
		this.props.startDate = v;
		this.touch();
	}
	public get endDate(): Date | null {
		return this.props.endDate;
	}
	public set endDate(v: Date | null) {
		this.props.endDate = v;
		this.touch();
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
	public get updatedAt(): Date {
		return this.props.updatedAt;
	}
}

