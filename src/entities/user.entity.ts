import { AggregateRoot, IdValueObject, Optional } from '../shared';
import { DEFAULT_USER_AVATAR } from '../shared/constants';

interface IUserProps {
  email: string;
  phone: string;
  password: string;
  name: string;
  avatar: string | null;
  isActive: boolean;
  adminRole: 'NONE' | 'AUDITOR' | 'ADMIN';
  agent?: any;
  roommate?: any;
  createdAt: Date;
  updatedAt: Date;
  resetOtpCode: string | null;
  resetOtpExpiresAt: Date | null;
}

export class UserEntity extends AggregateRoot<IUserProps> {
  static create(
    props: Optional<
      IUserProps,
      'avatar' | 'isActive' | 'adminRole' | 'createdAt' | 'updatedAt' | 'resetOtpCode' | 'resetOtpExpiresAt'
    >,
    id?: IdValueObject
  ) {
    return new UserEntity(
      {
        email: props.email,
        phone: props.phone,
        password: props.password,
        name: props.name,
        avatar: props.avatar ?? DEFAULT_USER_AVATAR,
        isActive: props.isActive ?? true,
        adminRole: props.adminRole ?? 'NONE',
        agent: props.agent,
        roommate: props.roommate,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        resetOtpCode: props.resetOtpCode ?? null,
        resetOtpExpiresAt: props.resetOtpExpiresAt ?? null,
      },
      id
    );
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  public get email(): string {
    return this.props.email;
  }
  public set email(v: string) {
    this.props.email = v;
    this.touch();
  }
  public get phone(): string {
    return this.props.phone;
  }
  public set phone(v: string) {
    this.props.phone = v;
    this.touch();
  }
  public get password(): string {
    return this.props.password;
  }
  public set password(v: string) {
    this.props.password = v;
    this.touch();
  }
  public get name(): string {
    return this.props.name;
  }
  public set name(v: string) {
    this.props.name = v;
    this.touch();
  }
  public get avatar(): string | null {
    return this.props.avatar;
  }
  public set avatar(v: string | null) {
    this.props.avatar = v;
    this.touch();
  }
  public get agent(): any | undefined {
    return this.props.agent;
  }
  public get roommate(): any | undefined {
    return this.props.roommate;
  }
  public get isActive(): boolean {
    return this.props.isActive;
  }
  public set isActive(v: boolean) {
    this.props.isActive = v;
    this.touch();
  }
  public get adminRole(): 'NONE' | 'AUDITOR' | 'ADMIN' {
    return this.props.adminRole;
  }
  public set adminRole(v: 'NONE' | 'AUDITOR' | 'ADMIN') {
    this.props.adminRole = v;
    this.touch();
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
  public get resetOtpCode(): string | null {
    return this.props.resetOtpCode;
  }
  public set resetOtpCode(v: string | null) {
    this.props.resetOtpCode = v;
    this.touch();
  }
  public get resetOtpExpiresAt(): Date | null {
    return this.props.resetOtpExpiresAt;
  }
  public set resetOtpExpiresAt(v: Date | null) {
    this.props.resetOtpExpiresAt = v;
    this.touch();
  }
}
