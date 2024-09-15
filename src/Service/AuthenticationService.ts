import jwt from "jsonwebtoken";

class UserAuthenticationService {
	private static jwtSecret: string = process.env.JWT_SECRET || "123";
	private static jwtExpirationTime: number = parseInt(
		process.env.JWT_EXPIRATION_TIME || "5000",
		10,
	);

	static generateJWT(
		email: string,
		userId: string,
	): { accessToken: string } {
		if (!UserAuthenticationService.jwtSecret) {
			throw new Error("JWT secret not provided");
		}

		if (isNaN(UserAuthenticationService.jwtExpirationTime)) {
			throw new Error("Invalid JWT expiration time");
		}

		const accessToken = jwt.sign(
			{ user_id: userId, email },
			UserAuthenticationService.jwtSecret,
			{ expiresIn: UserAuthenticationService.jwtExpirationTime },
		);

		return { accessToken };
	}

	static verifyJWT(authorizationHeader: string): {
		userId: string;
		email: string;
	} {
		const tokenParts = authorizationHeader.split(" ");
		if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
			throw new Error("Invalid authorization header format");
		}

		const accessToken = tokenParts[1];

		if (!UserAuthenticationService.jwtSecret) {
			throw new Error("JWT secret not provided");
		}

		const decoded = jwt.verify(
			accessToken,
			UserAuthenticationService.jwtSecret,
		) as { user_id: string; email: string };
		return {
			userId: decoded.user_id,
			email: decoded.email,
		};
	}
}

export default UserAuthenticationService;
