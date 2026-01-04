import { AggregateRoot, IdValueObject, Optional } from '../shared';

interface IUserProps {
  email: string;
  phone: string;
  password: string;
  name: string;
  avatar: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity extends AggregateRoot<IUserProps> {
  static create(
    props: Optional<
      IUserProps,
      'avatar' | 'isActive' | 'createdAt' | 'updatedAt'
    >,
    id?: IdValueObject
  ) {
    return new UserEntity(
      {
        email: props.email,
        phone: props.phone,
        password: props.password,
        name: props.name,
        avatar: props.avatar ?? null,
        isActive: props.isActive ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
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
  public get isActive(): boolean {
    return this.props.isActive;
  }
  public set isActive(v: boolean) {
    this.props.isActive = v;
    this.touch();
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
