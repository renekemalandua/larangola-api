import { AggregateRoot, IdValueObject, Optional } from '../shared';

interface IMessageProps {
	chatId: string;
	senderId: string;
	text: string;
	isRead: boolean;
	createdAt: Date;
}

export class MessageEntity extends AggregateRoot<IMessageProps> {
	static create(
		props: Optional<IMessageProps, 'isRead' | 'createdAt'>,
		id?: IdValueObject,
	) {
		return new MessageEntity(
			{
				chatId: props.chatId,
				senderId: props.senderId,
				text: props.text,
				isRead: props.isRead ?? false,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
	}

	public get chatId(): string {
		return this.props.chatId;
	}
	public get senderId(): string {
		return this.props.senderId;
	}
	public get text(): string {
		return this.props.text;
	}
	public set text(v: string) {
		this.props.text = v;
	}
	public get isRead(): boolean {
		return this.props.isRead;
	}
	public set isRead(v: boolean) {
		this.props.isRead = v;
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
}

