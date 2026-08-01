import { AggregateRoot, IdValueObject, Optional } from '../shared';

export enum PaymentType {
  subscription = 'subscription',
  commission = 'commission',
}

export enum PaymentStatus {
  pending = 'pending',
  paid = 'paid',
  rejected = 'rejected',
}

interface IPaymentProps {
  userId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  reference: string;
  method: string;
  proofImageUrl: string | null;
  rejectionReason: string | null;
  verifiedBy: string | null;
  relatedId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: any; // To pass populated user data
}

export class PaymentEntity extends AggregateRoot<IPaymentProps> {
  static create(
    props: Optional<
      IPaymentProps,
      'status' | 'method' | 'proofImageUrl' | 'rejectionReason' | 'verifiedBy' | 'relatedId' | 'createdAt' | 'updatedAt' | 'user'
    >,
    id?: IdValueObject
  ) {
    return new PaymentEntity(
      {
        userId: props.userId,
        type: props.type,
        amount: props.amount,
        status: props.status ?? PaymentStatus.pending,
        reference: props.reference,
        method: props.method ?? 'manual',
        proofImageUrl: props.proofImageUrl ?? null,
        rejectionReason: props.rejectionReason ?? null,
        verifiedBy: props.verifiedBy ?? null,
        relatedId: props.relatedId ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        user: props.user,
      },
      id
    );
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  public get userId(): string {
    return this.props.userId;
  }
  public get type(): PaymentType {
    return this.props.type;
  }
  public get amount(): number {
    return this.props.amount;
  }
  public get status(): PaymentStatus {
    return this.props.status;
  }
  public set status(v: PaymentStatus) {
    this.props.status = v;
    this.touch();
  }
  public get reference(): string {
    return this.props.reference;
  }
  public get method(): string {
    return this.props.method;
  }
  public get proofImageUrl(): string | null {
    return this.props.proofImageUrl;
  }
  public set proofImageUrl(v: string | null) {
    this.props.proofImageUrl = v;
    this.touch();
  }
  public get rejectionReason(): string | null {
    return this.props.rejectionReason;
  }
  public set rejectionReason(v: string | null) {
    this.props.rejectionReason = v;
    this.touch();
  }
  public get verifiedBy(): string | null {
    return this.props.verifiedBy;
  }
  public set verifiedBy(v: string | null) {
    this.props.verifiedBy = v;
    this.touch();
  }
  public get relatedId(): string | null {
    return this.props.relatedId;
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
  public get user(): any {
    return this.props.user;
  }
}
