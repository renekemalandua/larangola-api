import { AggregateRoot, IdValueObject, Optional } from '../shared';

interface IAgentProps {
  userId: string;
  profession: string | null;
  company: string | null;
  location: string | null;
  bio: string | null;
  description: string | null;
  isVerified: boolean;
  responseRate: number | null;
  averageResponseTime: string | null;
  propertiesCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export class AgentEntity extends AggregateRoot<IAgentProps> {
  static create(
    props: Optional<
      IAgentProps,
      | 'profession'
      | 'company'
      | 'location'
      | 'bio'
      | 'description'
      | 'isVerified'
      | 'responseRate'
      | 'averageResponseTime'
      | 'propertiesCount'
      | 'averageRating'
      | 'createdAt'
      | 'updatedAt'
    >,
    id?: IdValueObject
  ) {
    return new AgentEntity(
      {
        userId: props.userId,
        profession: props.profession ?? null,
        company: props.company ?? null,
        location: props.location ?? null,
        bio: props.bio ?? null,
        description: props.description ?? null,
        isVerified: props.isVerified ?? false,
        responseRate: props.responseRate ?? null,
        averageResponseTime: props.averageResponseTime ?? null,
        propertiesCount: props.propertiesCount ?? 0,
        averageRating: props.averageRating ?? 0,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
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
  public get profession(): string | null {
    return this.props.profession;
  }
  public set profession(v: string | null) {
    this.props.profession = v;
    this.touch();
  }
  public get company(): string | null {
    return this.props.company;
  }
  public set company(v: string | null) {
    this.props.company = v;
    this.touch();
  }
  public get location(): string | null {
    return this.props.location;
  }
  public set location(v: string | null) {
    this.props.location = v;
    this.touch();
  }
  public get bio(): string | null {
    return this.props.bio;
  }
  public set bio(v: string | null) {
    this.props.bio = v;
    this.touch();
  }
  public get description(): string | null {
    return this.props.description;
  }
  public set description(v: string | null) {
    this.props.description = v;
    this.touch();
  }
  public get isVerified(): boolean {
    return this.props.isVerified;
  }
  public set isVerified(v: boolean) {
    this.props.isVerified = v;
    this.touch();
  }
  public get responseRate(): number | null {
    return this.props.responseRate;
  }
  public set responseRate(v: number | null) {
    this.props.responseRate = v;
    this.touch();
  }
  public get averageResponseTime(): string | null {
    return this.props.averageResponseTime;
  }
  public set averageResponseTime(v: string | null) {
    this.props.averageResponseTime = v;
    this.touch();
  }
  public get propertiesCount(): number {
    return this.props.propertiesCount;
  }
  public set propertiesCount(v: number) {
    this.props.propertiesCount = v;
    this.touch();
  }
  public get averageRating(): number {
    return this.props.averageRating;
  }
  public set averageRating(v: number) {
    this.props.averageRating = v;
    this.touch();
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
