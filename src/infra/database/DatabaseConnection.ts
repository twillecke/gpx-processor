import pgp from "pg-promise";
import * as dotenv from "dotenv";

export default interface DataBaseConnection {
	query(statement: string, params: any): Promise<any>;
	close(): Promise<any>;
}

export class PgPromiseAdapter implements DataBaseConnection {
	connection: any;

	constructor() {
		dotenv.config();
		const POSTGRES_PORT = process.env.POSTGRES_PORT;
		const POSTGRES_USER = process.env.POSTGRES_USER;
		const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
		const POSTGRES_DB = process.env.POSTGRES_DB;
		const POSTGRES_HOST = process.env.POSTGRES_HOST;
		this.connection = pgp()(
			`postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
		);
	}

	async query(statement: string, params: any): Promise<any> {
		return this.connection.query(statement, params);
	}

	async close(): Promise<any> {
		return this.connection.$pool.end();
	}
}
