import * as dotenv from "dotenv";
const bcrypt = require("bcrypt");

export default class CypherService {
	constructor(readonly bcrypt: any) {}

	static async encrypt(password: string): Promise<string> {
		dotenv.config({ path: __dirname + '/../..' + '/.env' });		
		const saltRounds =
		parseInt(process.env.ENCRYPTION_SALT_ROUNDS as string);
		return await bcrypt.hash(password, saltRounds);
	}

	static async compare(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return await bcrypt.compare(plainPassword, hashedPassword);
	}
}
