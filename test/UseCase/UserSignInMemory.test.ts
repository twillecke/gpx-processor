import UserRepositoryMemory from "../../src/Repository/UserRepositoryMemory";
import UserAuthenticationService from "../../src/Service/AuthenticationService";
import UserSignIn from "../../src/UseCase/UserSignIn";
import UserSignUp from "../../src/UseCase/UserSignUp";

test("Should sign in a valid user", async () => {
	const userRepositoryMemory = new UserRepositoryMemory();
	const input = {
		email: "john.doe@mail.com",
		password: "1234",
	};
	const userSignUp = new UserSignUp(userRepositoryMemory);
	await userSignUp.execute(input);

	const userSignIn = new UserSignIn(userRepositoryMemory);
	const userSignInOutput = await userSignIn.execute(input);

	const authHeader = "Bearer " + userSignInOutput.accessToken;
	const verifyJWT = UserAuthenticationService.verifyJWT(authHeader);
	expect(verifyJWT.email).toBe(input.email);
	expect(verifyJWT.userId).toBeTruthy();
});

test("Should not sign in a invalid user", async () => {
	const userRepositoryMemory = new UserRepositoryMemory();
	const input = {
		email: "john.doe@mail.com.br",
		password: "123456",
	};
	const userSignIn = new UserSignIn(userRepositoryMemory);

	await expect(async () => await userSignIn.execute(input)).rejects.toThrow(
		new Error("Invalid credentials"),
	);
});
