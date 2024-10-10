import { UserRepository } from "./RepositoryInterfaces";
import { UserDAO } from "./UserRepositoryDatabase";

export type User = {
	userId: string;
	email: string;
	password: string;
};

export default class UserRepositoryMemory implements UserRepository {
	users: Array<UserDAO>;
	constructor() {
		this.users = [];
	}
	async getUserByEmail(email: string): Promise<UserDAO | undefined> {
		const user = await this.users.find(
			(user) => user.email_address === email,
		);
		return user;
	}
	async getUserById(userId: string): Promise<UserDAO> {
		const user = this.users.find((user) => user.user_id === userId);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}
	async saveUser(user: User): Promise<string> {
		const queriedUser: UserDAO = {
			user_id: user.userId,
			email_address: user.email,
			hashed_password: user.password, // You should hash the password before saving
		};
		this.users.push(queriedUser);
		return user.userId;
	}
	async removeUser(id: string): Promise<void> {
		this.users = this.users.filter((user) => user.user_id !== id);
	}
	async getAllUsers() {
		return this.users;
	}
}
