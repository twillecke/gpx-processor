import UserRepositoryMemory from "../../src/Repository/UserRepositoryMemory";
import UserSignUp from "../../src/UseCase/UserSignUp";

test("Should sign up a user", async () => {
	const userRepositoryMemory = new UserRepositoryMemory();
	const input = {
		email: "john.doe@mail.con",
		password: "1234",
	};
	const userSignUp = new UserSignUp(userRepositoryMemory);

	const userSignUpOutput = await userSignUp.execute(input);
	const storedUser = await userRepositoryMemory.getUserById(userSignUpOutput);

	expect(userSignUpOutput).toBe(storedUser.userId);
	expect(storedUser.email).toBe(input.email);
	console.log("storedUser", storedUser);
});
