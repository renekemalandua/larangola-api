import { AggregateRoot, IdValueObject, Optional } from '../shared';

interface IPropertyProps {
	ownerId: string;
	categoryId: string;
	title: string;
	description: string | null;
	address: string | null;
	city: string | null;
	state: string | null;
	country: string;
	latitude: number | null;
	longitude: number | null;
	bedrooms: number | null;
	bathrooms: number | null;
	area: number | null;
	propertyType: string;
	amenities: unknown | null;
	images: unknown | null;
	createdAt: Date;
	updatedAt: Date;
}

export class PropertyEntity extends AggregateRoot<IPropertyProps> {
	static create(
		props: Optional<IPropertyProps, 'description' | 'address' | 'city' | 'state' | 'country' | 'latitude' | 'longitude' | 'bedrooms' | 'bathrooms' | 'area' | 'amenities' | 'images' | 'createdAt' | 'updatedAt'>,
		id?: IdValueObject,
	) {
		return new PropertyEntity(
			{
				ownerId: props.ownerId,
				categoryId: props.categoryId,
				title: props.title,
				description: props.description ?? null,
				address: props.address ?? null,
				city: props.city ?? null,
				state: props.state ?? null,
				country: props.country ?? 'Angola',
				latitude: props.latitude ?? null,
				longitude: props.longitude ?? null,
				bedrooms: props.bedrooms ?? null,
				bathrooms: props.bathrooms ?? null,
				area: props.area ?? null,
				propertyType: props.propertyType,
				amenities: props.amenities ?? null,
				images: props.images ?? null,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		);
	}

	protected touch(): void {
		this.props.updatedAt = new Date();
	}

	public get ownerId(): string {
		return this.props.ownerId;
	}
	public get categoryId(): string {
		return this.props.categoryId;
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
	public get address(): string | null {
		return this.props.address;
	}
	public set address(v: string | null) {
		this.props.address = v;
		this.touch();
	}
	public get city(): string | null {
		return this.props.city;
	}
	public set city(v: string | null) {
		this.props.city = v;
		this.touch();
	}
	public get state(): string | null {
		return this.props.state;
	}
	public set state(v: string | null) {
		this.props.state = v;
		this.touch();
	}
	public get country(): string {
		return this.props.country;
	}
	public set country(v: string) {
		this.props.country = v;
		this.touch();
	}
	public get latitude(): number | null {
		return this.props.latitude;
	}
	public set latitude(v: number | null) {
		this.props.latitude = v;
		this.touch();
	}
	public get longitude(): number | null {
		return this.props.longitude;
	}
	public set longitude(v: number | null) {
		this.props.longitude = v;
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
	public get area(): number | null {
		return this.props.area;
	}
	public set area(v: number | null) {
		this.props.area = v;
		this.touch();
	}
	public get propertyType(): string {
		return this.props.propertyType;
	}
	public set propertyType(v: string) {
		this.props.propertyType = v;
		this.touch();
	}
	public get amenities(): unknown | null {
		return this.props.amenities;
	}
	public set amenities(v: unknown | null) {
		this.props.amenities = v;
		this.touch();
	}
	public get images(): unknown | null {
		return this.props.images;
	}
	public set images(v: unknown | null) {
		this.props.images = v;
		this.touch();
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
	public get updatedAt(): Date {
		return this.props.updatedAt;
	}
}


