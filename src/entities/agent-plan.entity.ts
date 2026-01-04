import { AggregateRoot, IdValueObject, Optional } from '../shared';

export enum PlanType {
  basic = 'basic',
  premium = 'premium',
  professional = 'professional',
  enterprise = 'enterprise',
}

interface IAgentPlanProps {
  type: PlanType;
  name: string;
  price: number;
  pricePeriod: string | null;
  description: string | null;
  features: unknown | null;
  isPopular: boolean;
  badge: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AgentPlanEntity extends AggregateRoot<IAgentPlanProps> {
  static create(
    props: Optional<
      IAgentPlanProps,
      | 'pricePeriod'
      | 'description'
      | 'features'
      | 'isPopular'
      | 'badge'
      | 'createdAt'
      | 'updatedAt'
    >,
    id?: IdValueObject
  ) {
    return new AgentPlanEntity(
      {
        type: props.type,
        name: props.name,
        price: props.price ?? 0,
        pricePeriod: props.pricePeriod ?? null,
        description: props.description ?? null,
        features: props.features ?? null,
        isPopular: props.isPopular ?? false,
        badge: props.badge ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  public get type(): PlanType {
    return this.props.type;
  }
  public get name(): string {
    return this.props.name;
  }
  public set name(v: string) {
    this.props.name = v;
    this.touch();
  }
  public get price(): number {
    return this.props.price;
  }
  public set price(v: number) {
    this.props.price = v;
    this.touch();
  }
  public get pricePeriod(): string | null {
    return this.props.pricePeriod;
  }
  public set pricePeriod(v: string | null) {
    this.props.pricePeriod = v;
    this.touch();
  }
  public get description(): string | null {
    return this.props.description;
  }
  public set description(v: string | null) {
    this.props.description = v;
    this.touch();
  }
  public get features(): unknown | null {
    return this.props.features;
  }
  public set features(v: unknown | null) {
    this.props.features = v;
    this.touch();
  }
  public get isPopular(): boolean {
    return this.props.isPopular;
  }
  public set isPopular(v: boolean) {
    this.props.isPopular = v;
    this.touch();
  }
  public get badge(): string | null {
    return this.props.badge;
  }
  public set badge(v: string | null) {
    this.props.badge = v;
    this.touch();
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
