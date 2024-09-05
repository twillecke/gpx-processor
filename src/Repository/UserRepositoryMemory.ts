import { UserRepository } from "./RepositoryInterfaces";

export type User = {
	userId: string;
	email: string;
	password: string;
};

export default class UserRepositoryMemory implements UserRepository {
	users: Array<User>;
	constructor() {
		this.users = [];
	}
	async getUserByEmail(email: string): Promise<User | undefined> {
		console.log("getUserByEmail", email);
		console.log("this.users", this.users);
		const user = this.users.find((user) => user.email === email);
		return Promise.resolve(user);
	}

	async getUserById(userId: string): Promise<User> {
		const user = this.users.find((user) => user.userId === userId);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}
	async saveUser(user: User): Promise<string> {
		this.users.push(user);
		return user.userId;
	}
	async removeUser(id: string): Promise<void> {
		this.users = this.users.filter((user) => user.userId !== id);
	}
	getAllUsers() {
		return this.users;
	}
}
