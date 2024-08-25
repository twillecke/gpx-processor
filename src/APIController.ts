import express, { Request, Response } from "express";
import TranslateGPX from "./UseCase/TranslateGPX";
import UserSaveNewTrack from "./UseCase/UserSaveNewTrack";
import { TrackRepository } from "./Repository/RepositoryInterfaces";
import multer from "multer";
import { asyncHandler } from "./ResponseErrorHandler";
export interface APIControllerDependencies {
	uploadMiddleware: multer.Multer;
	trackRepository: TrackRepository;
}

export default class APIController {
	private uploadMiddleware!: multer.Multer;
	private trackRepository!: TrackRepository;

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
}
