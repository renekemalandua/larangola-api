import { AggregateRoot, IdValueObject, Optional } from '../shared';

interface IPropertyCategoryProps {
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export class PropertyCategoryEntity extends AggregateRoot<IPropertyCategoryProps> {
	static create(
		props: Optional<IPropertyCategoryProps, 'description' | 'createdAt' | 'updatedAt'>,
		id?: IdValueObject,
	) {
		return new PropertyCategoryEntity(
			{
				name: props.name,
				description: props.description ?? null,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		);
	}

	protected touch(): void {
		this.props.updatedAt = new Date();
	}

	public get name(): string {
		return this.props.name;
	}
	public set name(v: string) {
		this.props.name = v;
		this.touch();
	}
	public get description(): string | null {
		return this.props.description;
	}
	public set description(v: string | null) {
		this.props.description = v;
		this.touch();
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
	public get updatedAt(): Date {
		return this.props.updatedAt;
	}
}
