import { randomUUID } from 'node:crypto';

export class IdValueObject {
	private value: string;

	toValue() {
		return this.value;
	}

	constructor(value?: string) {
		this.value = value ?? randomUUID();
	}
}


