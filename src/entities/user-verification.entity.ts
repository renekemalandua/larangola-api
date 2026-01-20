import { AggregateRoot, IdValueObject, Optional } from '../shared';
import { DocumentType, VerificationStepStatus } from '@prisma/client';

interface IUserVerificationProps {
  userId: string;
  documentType: DocumentType;
  documentNumber: string;
  nif: string | null;
  documentFrontUrl: string;
  documentBackUrl: string;
  selfieUrl: string;
  videoUrl: string;
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
      | 'nif'
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

  get documentType(): DocumentType {
    return this.props.documentType;
  }

  set documentType(value: DocumentType) {
    this.props.documentType = value;
    this.touch();
  }

  get documentNumber(): string {
    return this.props.documentNumber;
  }

  set documentNumber(value: string) {
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

  get documentFrontUrl(): string {
    return this.props.documentFrontUrl;
  }

  set documentFrontUrl(value: string) {
    this.props.documentFrontUrl = value;
    this.touch();
  }

  get documentBackUrl(): string {
    return this.props.documentBackUrl;
  }

  set documentBackUrl(value: string) {
    this.props.documentBackUrl = value;
    this.touch();
  }

  get selfieUrl(): string {
    return this.props.selfieUrl;
  }

  set selfieUrl(value: string) {
    this.props.selfieUrl = value;
    this.touch();
  }

  get videoUrl(): string {
    return this.props.videoUrl;
  }

  set videoUrl(value: string) {
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
