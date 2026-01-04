import { AggregateRoot, IdValueObject, Optional } from '../shared';

interface IChatProps {
  user1Id: string;
  user2Id: string;
  lastMessage: string | null;
  lastMessageTime: Date | null;
  unreadCountUser1: number;
  unreadCountUser2: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ChatEntity extends AggregateRoot<IChatProps> {
  static create(
    props: Optional<
      IChatProps,
      | 'lastMessage'
      | 'lastMessageTime'
      | 'unreadCountUser1'
      | 'unreadCountUser2'
      | 'isBlocked'
      | 'createdAt'
      | 'updatedAt'
    >,
    id?: IdValueObject
  ) {
    return new ChatEntity(
      {
        user1Id: props.user1Id,
        user2Id: props.user2Id,
        lastMessage: props.lastMessage ?? null,
        lastMessageTime: props.lastMessageTime ?? null,
        unreadCountUser1: props.unreadCountUser1 ?? 0,
        unreadCountUser2: props.unreadCountUser2 ?? 0,
        isBlocked: props.isBlocked ?? false,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  public get user1Id(): string {
    return this.props.user1Id;
  }
  public get user2Id(): string {
    return this.props.user2Id;
  }
  public get lastMessage(): string | null {
    return this.props.lastMessage;
  }
  public set lastMessage(v: string | null) {
    this.props.lastMessage = v;
    this.touch();
  }
  public get lastMessageTime(): Date | null {
    return this.props.lastMessageTime;
  }
  public set lastMessageTime(v: Date | null) {
    this.props.lastMessageTime = v;
    this.touch();
  }
  public get unreadCountUser1(): number {
    return this.props.unreadCountUser1;
  }
  public set unreadCountUser1(v: number) {
    this.props.unreadCountUser1 = v;
    this.touch();
  }
  public get unreadCountUser2(): number {
    return this.props.unreadCountUser2;
  }
  public set unreadCountUser2(v: number) {
    this.props.unreadCountUser2 = v;
    this.touch();
  }
  public get isBlocked(): boolean {
    return this.props.isBlocked;
  }
  public set isBlocked(v: boolean) {
    this.props.isBlocked = v;
    this.touch();
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
