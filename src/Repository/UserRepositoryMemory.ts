import { UserRepository } from "./RepositoryInterfaces";

export type User = {
	userId: string;
	name: string;
};

export default class UserRepositoryMemory implements UserRepository {
	users: Array<User>;
	constructor() {
		this.users = [];
	}
	async getUser(id: string): Promise<User> {
		const user = this.users.find((user) => user.userId === id);
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
