import { AggregateRoot, IdValueObject, Optional } from '../shared';

export enum WorkspaceType {
  MEETING_ROOM = 'MEETING_ROOM',
  PRIVATE_OFFICE = 'PRIVATE_OFFICE',
  COWORKING_DESK = 'COWORKING_DESK',
  EVENT_SPACE = 'EVENT_SPACE',
}

export enum WorkspacePricingType {
  PER_HOUR = 'PER_HOUR',
  PER_DAY = 'PER_DAY',
  BOTH = 'BOTH',
}

export interface IWorkspaceDetailsProps {
  propertyId: string;
  workspaceType: WorkspaceType;
  pricingType: WorkspacePricingType;
  pricePerHour: number | null;
  pricePerDay: number | null;
  capacitySeats: number;
  minBookingHours: number;
  hasHighSpeedWifi: boolean;
  hasGenerator: boolean;
  hasProjector: boolean;
  hasWhiteboard: boolean;
  hasAirConditioning: boolean;
  hasCoffeeBreak: boolean;
  hasParking: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkspaceDetailsEntity extends AggregateRoot<IWorkspaceDetailsProps> {
  static create(
    props: Optional<
      IWorkspaceDetailsProps,
      | 'pricingType'
      | 'pricePerHour'
      | 'pricePerDay'
      | 'minBookingHours'
      | 'hasHighSpeedWifi'
      | 'hasGenerator'
      | 'hasProjector'
      | 'hasWhiteboard'
      | 'hasAirConditioning'
      | 'hasCoffeeBreak'
      | 'hasParking'
      | 'createdAt'
      | 'updatedAt'
    >,
    id?: IdValueObject
  ) {
    return new WorkspaceDetailsEntity(
      {
        propertyId: props.propertyId,
        workspaceType: props.workspaceType,
        pricingType: props.pricingType ?? WorkspacePricingType.BOTH,
        pricePerHour: props.pricePerHour ?? null,
        pricePerDay: props.pricePerDay ?? null,
        capacitySeats: props.capacitySeats,
        minBookingHours: props.minBookingHours ?? 1,
        hasHighSpeedWifi: props.hasHighSpeedWifi ?? true,
        hasGenerator: props.hasGenerator ?? true,
        hasProjector: props.hasProjector ?? false,
        hasWhiteboard: props.hasWhiteboard ?? false,
        hasAirConditioning: props.hasAirConditioning ?? true,
        hasCoffeeBreak: props.hasCoffeeBreak ?? false,
        hasParking: props.hasParking ?? false,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  public get propertyId(): string {
    return this.props.propertyId;
  }

  public get workspaceType(): WorkspaceType {
    return this.props.workspaceType;
  }

  public get pricingType(): WorkspacePricingType {
    return this.props.pricingType;
  }

  public get pricePerHour(): number | null {
    return this.props.pricePerHour;
  }

  public get pricePerDay(): number | null {
    return this.props.pricePerDay;
  }

  public get capacitySeats(): number {
    return this.props.capacitySeats;
  }

  public get minBookingHours(): number {
    return this.props.minBookingHours;
  }

  public get hasHighSpeedWifi(): boolean {
    return this.props.hasHighSpeedWifi;
  }

  public get hasGenerator(): boolean {
    return this.props.hasGenerator;
  }

  public get hasProjector(): boolean {
    return this.props.hasProjector;
  }

  public get hasWhiteboard(): boolean {
    return this.props.hasWhiteboard;
  }

  public get hasAirConditioning(): boolean {
    return this.props.hasAirConditioning;
  }

  public get hasCoffeeBreak(): boolean {
    return this.props.hasCoffeeBreak;
  }

  public get hasParking(): boolean {
    return this.props.hasParking;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
