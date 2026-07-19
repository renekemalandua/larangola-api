import { AggregateRoot, IdValueObject, Optional } from '../shared';

export enum VisitStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  completed = 'completed',
  cancelled = 'cancelled',
}

interface IScheduledVisitProps {
  propertyId: string;
  userId: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: VisitStatus;
  notes: string | null;
  clientArrivedAt: Date | null;
  agentArrivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ScheduledVisitEntity extends AggregateRoot<IScheduledVisitProps> {
  static create(
    props: Optional<
      IScheduledVisitProps,
      'notes' | 'status' | 'createdAt' | 'updatedAt' | 'clientArrivedAt' | 'agentArrivedAt'
    >,
    id?: IdValueObject
  ) {
    return new ScheduledVisitEntity(
      {
        propertyId: props.propertyId,
        userId: props.userId,
        scheduledDate: props.scheduledDate,
        scheduledTime: props.scheduledTime,
        status: props.status ?? VisitStatus.pending,
        notes: props.notes ?? null,
        clientArrivedAt: props.clientArrivedAt ?? null,
        agentArrivedAt: props.agentArrivedAt ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  public get propertyId(): string {
    return this.props.propertyId;
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
  public get clientArrivedAt(): Date | null {
    return this.props.clientArrivedAt;
  }
  public set clientArrivedAt(v: Date | null) {
    this.props.clientArrivedAt = v;
    this.touch();
  }
  public get agentArrivedAt(): Date | null {
    return this.props.agentArrivedAt;
  }
  public set agentArrivedAt(v: Date | null) {
    this.props.agentArrivedAt = v;
    this.touch();
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
