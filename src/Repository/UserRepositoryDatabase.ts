import type DataBaseConnection from "../infra/database/DatabaseConnection";
import type { UserRepository } from "./RepositoryInterfaces";
import type { User } from "./UserRepositoryMemory";

export type UserDAO = {
	user_id: string;
	email_address: string;
	hashed_password: string;
};

export default class UserRepositoryDatabase implements UserRepository {
	constructor(readonly connection: DataBaseConnection) {}

	getAllUsers(): Promise<UserDAO[]> {
		throw new Error("Method not implemented.");
	}
	getUserById(id: string): Promise<UserDAO> {
		throw new Error("Method not implemented.");
	}
	async getUserByEmail(email: string): Promise<UserDAO | undefined> {
		const [user] = await this.connection.query(
			"SELECT * FROM users WHERE email_address = $1",
			[email],
		);
		if (!user) return;
		return user;
	}
	async saveUser(user: User): Promise<string> {
		if (!user.email || !user.password || !user.userId)
			return "Invalid input.";
		await this.connection.query(
			"INSERT into users (user_id, email_address, hashed_password) values ($1, $2, $3)",
			[user.userId, user.email, user.password],
		);
		return user.userId;
	}
	removeUser(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
