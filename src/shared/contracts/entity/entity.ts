import { IdValueObject } from './id.valueObject';

export class Entity<T> {
	private _id: IdValueObject;
	protected props: T;

	public get id() {
		return this._id.toValue();
	}

	protected constructor(props: T, id?: IdValueObject) {
		this.props = props;
		this._id = id ?? new IdValueObject();
	}
}

