import { AggregateRoot, IdValueObject, Optional } from '../shared';
import { PropertyRequestStatus } from '@prisma/client';

interface IPropertyRequestProps {
  userId: string;
  title: string;
  description: string | null;
  location: string;
  propertyType: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  status: PropertyRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class PropertyRequestEntity extends AggregateRoot<IPropertyRequestProps> {
  static create(
    props: Optional<
      IPropertyRequestProps,
      | 'description'
      | 'minPrice'
      | 'maxPrice'
      | 'bedrooms'
      | 'bathrooms'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
    >,
    id?: IdValueObject
  ) {
    return new PropertyRequestEntity(
      {
        userId: props.userId,
        title: props.title,
        description: props.description ?? null,
        location: props.location,
        propertyType: props.propertyType,
        minPrice: props.minPrice ?? null,
        maxPrice: props.maxPrice ?? null,
        bedrooms: props.bedrooms ?? null,
        bathrooms: props.bathrooms ?? null,
        status: props.status ?? PropertyRequestStatus.ACTIVE,
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
  public get title(): string {
    return this.props.title;
  }
  public set title(v: string) {
    this.props.title = v;
    this.touch();
  }
  public get description(): string | null {
    return this.props.description;
  }
  public set description(v: string | null) {
    this.props.description = v;
    this.touch();
  }
  public get location(): string {
    return this.props.location;
  }
  public set location(v: string) {
    this.props.location = v;
    this.touch();
  }
  public get propertyType(): string {
    return this.props.propertyType;
  }
  public set propertyType(v: string) {
    this.props.propertyType = v;
    this.touch();
  }
  public get minPrice(): number | null {
    return this.props.minPrice;
  }
  public set minPrice(v: number | null) {
    this.props.minPrice = v;
    this.touch();
  }
  public get maxPrice(): number | null {
    return this.props.maxPrice;
  }
  public set maxPrice(v: number | null) {
    this.props.maxPrice = v;
    this.touch();
  }
  public get bedrooms(): number | null {
    return this.props.bedrooms;
  }
  public set bedrooms(v: number | null) {
    this.props.bedrooms = v;
    this.touch();
  }
  public get bathrooms(): number | null {
    return this.props.bathrooms;
  }
  public set bathrooms(v: number | null) {
    this.props.bathrooms = v;
    this.touch();
  }
  public get status(): PropertyRequestStatus {
    return this.props.status;
  }
  public set status(v: PropertyRequestStatus) {
    this.props.status = v;
    this.touch();
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
