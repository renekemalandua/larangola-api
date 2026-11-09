import { AggregateRoot, IdValueObject, Optional } from '../shared';

export enum ClosedDealStatus {
  completed = 'completed',
  pending_payment = 'pending_payment',
}

export enum DealStage {
  VISIT_SCHEDULED = 'VISIT_SCHEDULED',
  VISIT_COMPLETED = 'VISIT_COMPLETED',
  NEGOTIATION = 'NEGOTIATION',
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  PAYMENT_SUBMITTED = 'PAYMENT_SUBMITTED',
  DEAL_CLOSED = 'DEAL_CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum PlatformFeeStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

interface IClosedDealProps {
  propertyId: string;
  agentId: string;
  clientId?: string | null;
  dealType?: string | null;
  dealAmount?: number | null;
  commissionAmount: number;
  commissionRate: number;
  status: ClosedDealStatus;
  stage: DealStage;

  paymentBankName?: string | null;
  paymentIban?: string | null;
  paymentAccountHolder?: string | null;
  isOwnerAccount?: boolean | null;

  clientPaymentReceiptUrl?: string | null;
  clientPaymentReceiptNote?: string | null;
  clientPaidAt?: Date | null;
  agentConfirmedAt?: Date | null;

  platformFeeRate: number;
  platformFeeAmount: number;
  platformFeeStatus: PlatformFeeStatus;
  agentFeeReceiptUrl?: string | null;
  agentFeeSubmittedAt?: Date | null;
  adminReviewedAt?: Date | null;
  adminReviewedBy?: string | null;
  adminRejectionReason?: string | null;

  closedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ClosedDealEntity extends AggregateRoot<IClosedDealProps> {
  static create(
    props: Optional<
      IClosedDealProps,
      | 'status'
      | 'stage'
      | 'platformFeeRate'
      | 'platformFeeAmount'
      | 'platformFeeStatus'
      | 'createdAt'
      | 'updatedAt'
    >,
    id?: IdValueObject
  ) {
    const rate = props.platformFeeRate ?? 20.0;
    const amount = props.platformFeeAmount ?? (props.dealAmount ? props.dealAmount * (rate / 100) : 0);

    return new ClosedDealEntity(
      {
        propertyId: props.propertyId,
        agentId: props.agentId,
        clientId: props.clientId,
        dealType: props.dealType,
        dealAmount: props.dealAmount,
        commissionAmount: props.commissionAmount,
        commissionRate: props.commissionRate,
        status: props.status ?? ClosedDealStatus.pending_payment,
        stage: props.stage ?? DealStage.VISIT_SCHEDULED,

        paymentBankName: props.paymentBankName,
        paymentIban: props.paymentIban,
        paymentAccountHolder: props.paymentAccountHolder,
        isOwnerAccount: props.isOwnerAccount ?? false,

        clientPaymentReceiptUrl: props.clientPaymentReceiptUrl,
        clientPaymentReceiptNote: props.clientPaymentReceiptNote,
        clientPaidAt: props.clientPaidAt,
        agentConfirmedAt: props.agentConfirmedAt,

        platformFeeRate: rate,
        platformFeeAmount: amount,
        platformFeeStatus: props.platformFeeStatus ?? PlatformFeeStatus.PENDING,
        agentFeeReceiptUrl: props.agentFeeReceiptUrl,
        agentFeeSubmittedAt: props.agentFeeSubmittedAt,
        adminReviewedAt: props.adminReviewedAt,
        adminReviewedBy: props.adminReviewedBy,
        adminRejectionReason: props.adminRejectionReason,

        closedDate: props.closedDate,
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
  public get agentId(): string {
    return this.props.agentId;
  }
  public get clientId(): string | null | undefined {
    return this.props.clientId;
  }
  public get dealType(): string | null | undefined {
    return this.props.dealType;
  }
  public set dealType(v: string | null | undefined) {
    this.props.dealType = v;
    this.touch();
  }
  public get dealAmount(): number | null | undefined {
    return this.props.dealAmount;
  }
  public set dealAmount(v: number | null | undefined) {
    this.props.dealAmount = v;
    if (v) {
      this.props.platformFeeAmount = v * (this.props.platformFeeRate / 100);
    }
    this.touch();
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
  public get stage(): DealStage {
    return this.props.stage;
  }
  public set stage(v: DealStage) {
    this.props.stage = v;
    this.touch();
  }

  public get paymentBankName(): string | null | undefined {
    return this.props.paymentBankName;
  }
  public set paymentBankName(v: string | null | undefined) {
    this.props.paymentBankName = v;
    this.touch();
  }
  public get paymentIban(): string | null | undefined {
    return this.props.paymentIban;
  }
  public set paymentIban(v: string | null | undefined) {
    this.props.paymentIban = v;
    this.touch();
  }
  public get paymentAccountHolder(): string | null | undefined {
    return this.props.paymentAccountHolder;
  }
  public set paymentAccountHolder(v: string | null | undefined) {
    this.props.paymentAccountHolder = v;
    this.touch();
  }
  public get isOwnerAccount(): boolean | null | undefined {
    return this.props.isOwnerAccount;
  }
  public set isOwnerAccount(v: boolean | null | undefined) {
    this.props.isOwnerAccount = v;
    this.touch();
  }

  public get clientPaymentReceiptUrl(): string | null | undefined {
    return this.props.clientPaymentReceiptUrl;
  }
  public set clientPaymentReceiptUrl(v: string | null | undefined) {
    this.props.clientPaymentReceiptUrl = v;
    this.touch();
  }
  public get clientPaymentReceiptNote(): string | null | undefined {
    return this.props.clientPaymentReceiptNote;
  }
  public set clientPaymentReceiptNote(v: string | null | undefined) {
    this.props.clientPaymentReceiptNote = v;
    this.touch();
  }
  public get clientPaidAt(): Date | null | undefined {
    return this.props.clientPaidAt;
  }
  public set clientPaidAt(v: Date | null | undefined) {
    this.props.clientPaidAt = v;
    this.touch();
  }
  public get agentConfirmedAt(): Date | null | undefined {
    return this.props.agentConfirmedAt;
  }
  public set agentConfirmedAt(v: Date | null | undefined) {
    this.props.agentConfirmedAt = v;
    this.touch();
  }

  public get platformFeeRate(): number {
    return this.props.platformFeeRate;
  }
  public set platformFeeRate(v: number) {
    this.props.platformFeeRate = v;
    if (this.props.dealAmount) {
      this.props.platformFeeAmount = this.props.dealAmount * (v / 100);
    }
    this.touch();
  }
  public get platformFeeAmount(): number {
    return this.props.platformFeeAmount;
  }
  public set platformFeeAmount(v: number) {
    this.props.platformFeeAmount = v;
    this.touch();
  }
  public get platformFeeStatus(): PlatformFeeStatus {
    return this.props.platformFeeStatus;
  }
  public set platformFeeStatus(v: PlatformFeeStatus) {
    this.props.platformFeeStatus = v;
    this.touch();
  }
  public get agentFeeReceiptUrl(): string | null | undefined {
    return this.props.agentFeeReceiptUrl;
  }
  public set agentFeeReceiptUrl(v: string | null | undefined) {
    this.props.agentFeeReceiptUrl = v;
    this.touch();
  }
  public get agentFeeSubmittedAt(): Date | null | undefined {
    return this.props.agentFeeSubmittedAt;
  }
  public set agentFeeSubmittedAt(v: Date | null | undefined) {
    this.props.agentFeeSubmittedAt = v;
    this.touch();
  }
  public get adminReviewedAt(): Date | null | undefined {
    return this.props.adminReviewedAt;
  }
  public set adminReviewedAt(v: Date | null | undefined) {
    this.props.adminReviewedAt = v;
    this.touch();
  }
  public get adminReviewedBy(): string | null | undefined {
    return this.props.adminReviewedBy;
  }
  public set adminReviewedBy(v: string | null | undefined) {
    this.props.adminReviewedBy = v;
    this.touch();
  }
  public get adminRejectionReason(): string | null | undefined {
    return this.props.adminRejectionReason;
  }
  public set adminRejectionReason(v: string | null | undefined) {
    this.props.adminRejectionReason = v;
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

export interface IAgentBankAccountProps {
  agentId: string;
  bankName: string;
  iban: string;
  accountHolder: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AgentBankAccountEntity extends AggregateRoot<IAgentBankAccountProps> {
  static create(
    props: Optional<IAgentBankAccountProps, 'isFavorite' | 'createdAt' | 'updatedAt'>,
    id?: IdValueObject
  ) {
    return new AgentBankAccountEntity(
      {
        agentId: props.agentId,
        bankName: props.bankName,
        iban: props.iban,
        accountHolder: props.accountHolder,
        isFavorite: props.isFavorite ?? false,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  public get agentId(): string {
    return this.props.agentId;
  }
  public get bankName(): string {
    return this.props.bankName;
  }
  public set bankName(v: string) {
    this.props.bankName = v;
    this.touch();
  }
  public get iban(): string {
    return this.props.iban;
  }
  public set iban(v: string) {
    this.props.iban = v;
    this.touch();
  }
  public get accountHolder(): string {
    return this.props.accountHolder;
  }
  public set accountHolder(v: string) {
    this.props.accountHolder = v;
    this.touch();
  }
  public get isFavorite(): boolean {
    return this.props.isFavorite;
  }
  public set isFavorite(v: boolean) {
    this.props.isFavorite = v;
    this.touch();
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}

