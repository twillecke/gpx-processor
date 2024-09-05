import * as dotenv from "dotenv";
dotenv.config();

export default class CheckEnvironmentVariables {
	private static readonly REQUIRED_ENV_VARS: string[] = ["PORT", "ENCRYPTION_SALT_ROUNDS"];

	static execute(): void {
		this.REQUIRED_ENV_VARS.forEach((varName) => {
			if (!process.env[varName]) {
				console.error(
					`Error: Required environment variable ${varName} is not defined`,
				);
				process.exit(1);
			}
		});
	}
}
