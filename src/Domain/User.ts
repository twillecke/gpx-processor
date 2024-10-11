import crypto from "node:crypto";

export default class User {
	readonly userId: string;
	email: string;
	password: string;

	private constructor(userId: string, email: string, password: string) {
		if (!email || !password) {
			throw new Error("Invalid input.");
		}
		const emailRegex = /\S+@\S+\.\S+/;
		if (!emailRegex.test(email)) {
			throw new Error("Invalid email.");
		}
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
