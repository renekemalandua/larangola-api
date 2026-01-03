import { AggregateRoot, IdValueObject, Optional } from '../shared';

interface IRoommateProps {
	userId: string;
	age: number | null;
	profession: string | null;
	company: string | null;
	location: string | null;
	budget: number | null;
	moveInDate: Date | null;
	bio: string | null;
	isVerified: boolean;
	responseRate: number | null;
	averageResponseTime: string | null;
	rating: number | null;
	lookingForRoommate: boolean;
	preferences: unknown | null;
	lifestyle: unknown | null;
	interests: unknown | null;
	languages: unknown | null;
	joinDate: Date;
	createdAt: Date;
	updatedAt: Date;
}

export class RoommateEntity extends AggregateRoot<IRoommateProps> {
	static create(
		props: Optional<IRoommateProps, 'age' | 'profession' | 'company' | 'location' | 'budget' | 'moveInDate' | 'bio' | 'isVerified' | 'responseRate' | 'averageResponseTime' | 'rating' | 'lookingForRoommate' | 'preferences' | 'lifestyle' | 'interests' | 'languages' | 'joinDate' | 'createdAt' | 'updatedAt'>,
		id?: IdValueObject,
	) {
		return new RoommateEntity(
			{
				userId: props.userId,
				age: props.age ?? null,
				profession: props.profession ?? null,
				company: props.company ?? null,
				location: props.location ?? null,
				budget: props.budget ?? null,
				moveInDate: props.moveInDate ?? null,
				bio: props.bio ?? null,
				isVerified: props.isVerified ?? false,
				responseRate: props.responseRate ?? null,
				averageResponseTime: props.averageResponseTime ?? null,
				rating: props.rating ?? null,
				lookingForRoommate: props.lookingForRoommate ?? false,
				preferences: props.preferences ?? null,
				lifestyle: props.lifestyle ?? null,
				interests: props.interests ?? null,
				languages: props.languages ?? null,
				joinDate: props.joinDate ?? new Date(),
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		);
	}

	protected touch(): void {
		this.props.updatedAt = new Date();
	}

	public get userId(): string {
		return this.props.userId;
	}
	public get age(): number | null {
		return this.props.age;
	}
	public set age(v: number | null) {
		this.props.age = v;
		this.touch();
	}
	public get profession(): string | null {
		return this.props.profession;
	}
	public set profession(v: string | null) {
		this.props.profession = v;
		this.touch();
	}
	public get company(): string | null {
		return this.props.company;
	}
	public set company(v: string | null) {
		this.props.company = v;
		this.touch();
	}
	public get location(): string | null {
		return this.props.location;
	}
	public set location(v: string | null) {
		this.props.location = v;
		this.touch();
	}
	public get budget(): number | null {
		return this.props.budget;
	}
	public set budget(v: number | null) {
		this.props.budget = v;
		this.touch();
	}
	public get moveInDate(): Date | null {
		return this.props.moveInDate;
	}
	public set moveInDate(v: Date | null) {
		this.props.moveInDate = v;
		this.touch();
	}
	public get bio(): string | null {
		return this.props.bio;
	}
	public set bio(v: string | null) {
		this.props.bio = v;
		this.touch();
	}
	public get isVerified(): boolean {
		return this.props.isVerified;
	}
	public set isVerified(v: boolean) {
		this.props.isVerified = v;
		this.touch();
	}
	public get responseRate(): number | null {
		return this.props.responseRate;
	}
	public set responseRate(v: number | null) {
		this.props.responseRate = v;
		this.touch();
	}
	public get averageResponseTime(): string | null {
		return this.props.averageResponseTime;
	}
	public set averageResponseTime(v: string | null) {
		this.props.averageResponseTime = v;
		this.touch();
	}
	public get rating(): number | null {
		return this.props.rating;
	}
	public set rating(v: number | null) {
		this.props.rating = v;
		this.touch();
	}
	public get lookingForRoommate(): boolean {
		return this.props.lookingForRoommate;
	}
	public set lookingForRoommate(v: boolean) {
		this.props.lookingForRoommate = v;
		this.touch();
	}
	public get preferences(): unknown | null {
		return this.props.preferences;
	}
	public set preferences(v: unknown | null) {
		this.props.preferences = v;
		this.touch();
	}
	public get lifestyle(): unknown | null {
		return this.props.lifestyle;
	}
	public set lifestyle(v: unknown | null) {
		this.props.lifestyle = v;
		this.touch();
	}
	public get interests(): unknown | null {
		return this.props.interests;
	}
	public set interests(v: unknown | null) {
		this.props.interests = v;
		this.touch();
	}
	public get languages(): unknown | null {
		return this.props.languages;
	}
	public set languages(v: unknown | null) {
		this.props.languages = v;
		this.touch();
	}
	public get joinDate(): Date {
		return this.props.joinDate;
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
	public get updatedAt(): Date {
		return this.props.updatedAt;
	}
}

