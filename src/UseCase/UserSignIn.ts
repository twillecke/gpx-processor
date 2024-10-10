import { UserRepository } from "../Repository/RepositoryInterfaces";
import UserAuthenticationService from "../Service/AuthenticationService";
import CypherService from "../Service/CypherService";

type Input = {
	email: string;
	password: string;
};

export default class UserSignIn {
	private userRepository: UserRepository;
	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}
	async execute(input: Input) {
		const existingUser = await this.userRepository.getUserByEmail(
			input.email,
		);
		if (!existingUser) {
			throw new Error("Invalid credentials");
		}
		const isValidPassword = await CypherService.compare(
			input.password,
			existingUser.hashed_password,
		);
		if (!isValidPassword) {
			throw new Error("Invalid credentials");
		}
		const accessToken = UserAuthenticationService.generateJWT(
			existingUser.email_address,
			existingUser.user_id,
		);

		return {
			accessToken: accessToken.accessToken,
			userId: existingUser.user_id,
		};
	}
}
