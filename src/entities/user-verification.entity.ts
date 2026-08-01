import { AggregateRoot, IdValueObject, Optional } from '../shared';
import { DocumentType, VerificationStepStatus } from '@prisma/client';

interface IUserVerificationProps {
  userId: string;
  currentStep: number;
  status: string;
  phone: string | null;
  zonesOfOperation: any | null;
  documentType: DocumentType | null;
  documentNumber: string | null;
  nif: string | null;
  documentFrontUrl: string | null;
  documentBackUrl: string | null;
  selfieUrl: string | null;
  videoUrl: string | null;
  step1Status: VerificationStepStatus;
  step1ReviewedAt: Date | null;
  step1ReviewedBy: string | null;
  step2Status: VerificationStepStatus | null;
  step2ReviewedAt: Date | null;
  step2ReviewedBy: string | null;
  step2Notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserVerificationEntity extends AggregateRoot<IUserVerificationProps> {
  static create(
    props: Optional<
      IUserVerificationProps,
      | 'currentStep'
      | 'status'
      | 'phone'
      | 'zonesOfOperation'
      | 'documentType'
      | 'documentNumber'
      | 'nif'
      | 'documentFrontUrl'
      | 'documentBackUrl'
      | 'selfieUrl'
      | 'videoUrl'
      | 'step1Status'
      | 'step1ReviewedAt'
      | 'step1ReviewedBy'
      | 'step2Status'
      | 'step2ReviewedAt'
      | 'step2ReviewedBy'
      | 'step2Notes'
      | 'createdAt'
      | 'updatedAt'
    >,
    id?: IdValueObject
  ) {
    return new UserVerificationEntity(
      {
        ...props,
        currentStep: props.currentStep ?? 1,
        status: props.status ?? 'DRAFT',
        phone: props.phone ?? null,
        zonesOfOperation: props.zonesOfOperation ?? null,
        documentType: props.documentType ?? null,
        documentNumber: props.documentNumber ?? null,
        documentFrontUrl: props.documentFrontUrl ?? null,
        documentBackUrl: props.documentBackUrl ?? null,
        selfieUrl: props.selfieUrl ?? null,
        videoUrl: props.videoUrl ?? null,
        nif: props.nif ?? null,
        step1Status: props.step1Status ?? VerificationStepStatus.PENDING,
        step1ReviewedAt: props.step1ReviewedAt ?? null,
        step1ReviewedBy: props.step1ReviewedBy ?? null,
        step2Status: props.step2Status ?? null,
        step2ReviewedAt: props.step2ReviewedAt ?? null,
        step2ReviewedBy: props.step2ReviewedBy ?? null,
        step2Notes: props.step2Notes ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  get userId(): string {
    return this.props.userId;
  }

  get currentStep(): number { return this.props.currentStep; }
  set currentStep(v: number) { this.props.currentStep = v; this.touch(); }

  get status(): string { return this.props.status; }
  set status(v: string) { this.props.status = v; this.touch(); }

  get phone(): string | null { return this.props.phone; }
  set phone(v: string | null) { this.props.phone = v; this.touch(); }

  get zonesOfOperation(): any | null { return this.props.zonesOfOperation; }
  set zonesOfOperation(v: any | null) { this.props.zonesOfOperation = v; this.touch(); }

  get documentType(): DocumentType | null {
    return this.props.documentType;
  }

  set documentType(value: DocumentType | null) {
    this.props.documentType = value;
    this.touch();
  }

  get documentNumber(): string | null {
    return this.props.documentNumber;
  }

  set documentNumber(value: string | null) {
    this.props.documentNumber = value;
    this.touch();
  }

  get nif(): string | null {
    return this.props.nif;
  }

  set nif(value: string | null) {
    this.props.nif = value;
    this.touch();
  }

  get documentFrontUrl(): string | null {
    return this.props.documentFrontUrl;
  }

  set documentFrontUrl(value: string | null) {
    this.props.documentFrontUrl = value;
    this.touch();
  }

  get documentBackUrl(): string | null {
    return this.props.documentBackUrl;
  }

  set documentBackUrl(value: string | null) {
    this.props.documentBackUrl = value;
    this.touch();
  }

  get selfieUrl(): string | null {
    return this.props.selfieUrl;
  }

  set selfieUrl(value: string | null) {
    this.props.selfieUrl = value;
    this.touch();
  }

  get videoUrl(): string | null {
    return this.props.videoUrl;
  }

  set videoUrl(value: string | null) {
    this.props.videoUrl = value;
    this.touch();
  }

  get step1Status(): VerificationStepStatus {
    return this.props.step1Status;
  }

  set step1Status(value: VerificationStepStatus) {
    this.props.step1Status = value;
    this.touch();
  }

  get step1ReviewedAt(): Date | null {
    return this.props.step1ReviewedAt;
  }

  set step1ReviewedAt(value: Date | null) {
    this.props.step1ReviewedAt = value;
    this.touch();
  }

  get step1ReviewedBy(): string | null {
    return this.props.step1ReviewedBy;
  }

  set step1ReviewedBy(value: string | null) {
    this.props.step1ReviewedBy = value;
    this.touch();
  }

  get step2Status(): VerificationStepStatus | null {
    return this.props.step2Status;
  }

  set step2Status(value: VerificationStepStatus | null) {
    this.props.step2Status = value;
    this.touch();
  }

  get step2ReviewedAt(): Date | null {
    return this.props.step2ReviewedAt;
  }

  set step2ReviewedAt(value: Date | null) {
    this.props.step2ReviewedAt = value;
    this.touch();
  }

  get step2ReviewedBy(): string | null {
    return this.props.step2ReviewedBy;
  }

  set step2ReviewedBy(value: string | null) {
    this.props.step2ReviewedBy = value;
    this.touch();
  }

  get step2Notes(): string | null {
    return this.props.step2Notes;
  }

  set step2Notes(value: string | null) {
    this.props.step2Notes = value;
    this.touch();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
