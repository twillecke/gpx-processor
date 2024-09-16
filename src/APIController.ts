import express, { Request, Response } from "express";
import TranslateGPX from "./UseCase/TranslateGPX";
import UserSaveNewTrack from "./UseCase/UserSaveNewTrack";
import {
	TrackRepository,
	UserRepository,
} from "./Repository/RepositoryInterfaces";
import multer from "multer";
import { asyncHandler } from "./ResponseErrorHandler";
import UserSignUp from "./UseCase/UserSignUp";
import UserSignIn from "./UseCase/UserSignIn";
import UserAuthenticationService from "./Service/AuthenticationService";
export interface APIControllerDependencies {
	uploadMiddleware: multer.Multer;
	trackRepository: TrackRepository;
	userRepository: UserRepository;
}

export default class APIController {
	private uploadMiddleware!: multer.Multer;
	private trackRepository!: TrackRepository;
	private userRepository!: UserRepository;

	constructor(
		private app: express.Application,
		dependencies: APIControllerDependencies,
	) {
		this.setupDependencies(dependencies);
		this.setupRoutes();
	}

	private setupDependencies(dependencies: APIControllerDependencies) {
		this.uploadMiddleware = dependencies.uploadMiddleware;
		this.trackRepository = dependencies.trackRepository;
		this.userRepository = dependencies.userRepository;
	}

	private setupRoutes() {
		this.app.post(
			"/translate-gpx",
			this.uploadMiddleware.single("file"),
			asyncHandler(this.translateGpx),
		);
		this.app.post(
			"/track",
			this.uploadMiddleware.single("file"),
			asyncHandler(this.saveTrack),
		);
		this.app.get("/track", asyncHandler(this.getAllTracks));
		this.app.get("/track/:trackId", asyncHandler(this.getTrackById));
		this.app.get(
			"/track-metadata",
			asyncHandler(this.getAllTracksMetadata),
		);
		this.app.post("/create-user", asyncHandler(this.createUser));
		this.app.post("/sign-in-user", asyncHandler(this.signInUser));
		this.app.get("/user", (req: Request, res: Response) => {
			asyncHandler(this.getAllUsers(req, res));
		});
		this.app.post("/authenticate", (req: Request, res: Response) => {
			asyncHandler(this.authenticate(req, res));
		});
	}

	private translateGpx = async (req: Request, res: Response) => {
		const file = req.file?.buffer;
		if (!file) {
			return res.status(400).send("No file uploaded.");
		}
		const gpxString = file.toString("utf-8");
		const output = await TranslateGPX.execute(gpxString);
		res.status(200).json({
			message: "File uploaded and processed successfully.",
			result: output,
		});
	};

	private saveTrack = async (req: Request, res: Response) => {
		// TODO: Add validation for metadata and trackData
		// TODO: Pass the authorId from the JWT token
		const input = {
			metadata: req.body.metadata,
			trackData: req.body.trackData,
		};
		if (!input.metadata || !input.trackData)
			return res.status(400).send("Invalid input.");
		// get userId from JWT token
		const userSaveNewTrack = new UserSaveNewTrack(this.trackRepository);
		const output = await userSaveNewTrack.execute({
			metadata: req.body.metadata,
			trackData: req.body.trackData,
		});
		if (!output) return res.status(500).send("Error saving track.");
		res.status(200).json({ trackId: output });
	};

	private getAllTracks = async (req: Request, res: Response) => {
		const tracks = await this.trackRepository.getAllTracks();
		res.status(200).json(tracks);
	};

	private getTrackById = async (req: Request, res: Response) => {
		const track = await this.trackRepository.getTrackById(
			req.params.trackId,
		);
		if (!track) return res.status(404).send("Track not found.");
		res.status(200).json(track);
	};

	private getAllTracksMetadata = async (req: Request, res: Response) => {
		const tracks = await this.trackRepository.getAllTracksMetadata();
		res.status(200).json(tracks);
	};

	private createUser = async (req: Request, res: Response) => {
		const input = {
			email: req.body.email,
			password: req.body.password,
		};
		if (!input.email || !input.password)
			return res.status(400).send("Invalid input.");
		const userSignUp = new UserSignUp(this.userRepository);
		const output = await userSignUp.execute(input);
		if (!output) return res.status(500).send("Error saving user.");
		res.status(200).json({ userId: output });
	};

	private signInUser = async (req: Request, res: Response) => {
		const input = {
			email: req.body.email,
			password: req.body.password,
		};
		if (!input.email || !input.password)
			return res.status(400).send("Invalid input.");
		const userSignIn = new UserSignIn(this.userRepository);
		const output = await userSignIn.execute(input);
		if (!output) return res.status(500).send("Error signing in user.");
		res.status(200).json(output);
	};

	private getAllUsers = async (req: Request, res: Response) => {
		try {
			const users = await this.userRepository.getAllUsers();
			res.status(200).json(users);
		} catch (error) {
			res.status(500).send("Error fetching users.");
		}
	};

	private authenticate = async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization;
		if (!authHeader) return res.status(401).send("No token provided.");
		try {
			const isValidToken =
				UserAuthenticationService.verifyJWT(authHeader);
			if (!isValidToken) return res.status(401).send("Invalid token.");
			return res.status(200).send("Authenticated.");
		} catch (error) {
			return res.status(500).send("Error verifying token.");
		}
	};
}
