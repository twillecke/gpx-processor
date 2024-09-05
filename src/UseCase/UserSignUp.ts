import User from "../Domain/User";
import { UserRepository } from "../Repository/RepositoryInterfaces";
import CypherService from "../Service/CypherService";

type Input = {
    email: string;
    password: string;
};

export default class UserSignUp {
    userRepository: UserRepository;
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }
    async execute(input: Input): Promise<string> {
        const existingUserEmail = await this.userRepository.getUserByEmail(input.email);
        if (existingUserEmail) {
            throw new Error("Email address already exists");
        }
        const hashedPassword = await CypherService.encrypt(input.password);
        const user = await User.create({ email: input.email, password: hashedPassword });
        const savedUserId = await this.userRepository.saveUser(user);
        return savedUserId;
    }
}