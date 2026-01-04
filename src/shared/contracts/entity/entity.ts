import { IdValueObject } from './id.valueObject';

export abstract class Entity<T> {
	protected props: T;
	public readonly id: string;

	constructor(props: T, id?: IdValueObject) {
		this.props = props;
		this.id = id?.toValue() ?? new IdValueObject().toValue();
	}

	public equals(entity?: Entity<T>): boolean {
		if (entity === null || entity === undefined) {
			return false;
		}

		if (this === entity) {
			return true;
		}

		if (!(entity instanceof Entity)) {
			return false;
		}

		return this.id === entity.id;
	}
}

