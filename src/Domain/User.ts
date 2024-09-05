import crypto from "crypto";

export default class User {
	readonly userId: string;
	email: string;
	password: string;

	private constructor(userId: string, email: string, password: string) {
		this.userId = userId;
		this.email = email;
		this.password = password;
	}

	static async create(input: {
		email: string;
		password: string;
	}): Promise<User> {
		const userId = crypto.randomUUID();
		return new User(userId, input.email, input.password);
	}

	getUserId(): string {
		return this.userId;
	}
	getEmail(): string {
		return this.email;
	}
	getPassword(): string {
		return this.password;
	}
}
