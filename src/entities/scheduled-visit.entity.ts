import { AggregateRoot, IdValueObject, Optional } from '../shared';

export enum VisitStatus {
	pending = 'pending',
	confirmed = 'confirmed',
	completed = 'completed',
	cancelled = 'cancelled',
}

interface IScheduledVisitProps {
	listingId: string;
	userId: string;
	scheduledDate: Date;
	scheduledTime: string;
	status: VisitStatus;
	notes: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export class ScheduledVisitEntity extends AggregateRoot<IScheduledVisitProps> {
	static create(
		props: Optional<IScheduledVisitProps, 'notes' | 'status' | 'createdAt' | 'updatedAt'>,
		id?: IdValueObject,
	) {
		return new ScheduledVisitEntity(
			{
				listingId: props.listingId,
				userId: props.userId,
				scheduledDate: props.scheduledDate,
				scheduledTime: props.scheduledTime,
				status: props.status ?? VisitStatus.pending,
				notes: props.notes ?? null,
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
	public get scheduledDate(): Date {
		return this.props.scheduledDate;
	}
	public set scheduledDate(v: Date) {
		this.props.scheduledDate = v;
		this.touch();
	}
	public get scheduledTime(): string {
		return this.props.scheduledTime;
	}
	public set scheduledTime(v: string) {
		this.props.scheduledTime = v;
		this.touch();
	}
	public get status(): VisitStatus {
		return this.props.status;
	}
	public set status(v: VisitStatus) {
		this.props.status = v;
		this.touch();
	}
	public get notes(): string | null {
		return this.props.notes;
	}
	public set notes(v: string | null) {
		this.props.notes = v;
		this.touch();
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
	public get updatedAt(): Date {
		return this.props.updatedAt;
	}
}

