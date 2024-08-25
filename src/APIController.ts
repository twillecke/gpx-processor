import express, { Request, Response } from "express";
import TranslateGPX from "./UseCase/TranslateGPX";
import UserSaveNewTrack from "./UseCase/UserSaveNewTrack";
import { TrackRepository } from "./Repository/RepositoryInterfaces";
import multer from "multer";

export interface APIControllerDependencies {
	uploadMiddleware: multer.Multer;
	trackRepository: TrackRepository;
}

export default class APIController {
	private uploadMiddleware: multer.Multer;
	private trackRepository: TrackRepository;

	constructor(
		private app: express.Application,
		dependencies: APIControllerDependencies,
	) {
		this.uploadMiddleware = dependencies.uploadMiddleware;
		this.trackRepository = dependencies.trackRepository;
		this.setupRoutes();
	}

	private setupRoutes() {
		this.app.post(
			"/translate-gpx",
			this.uploadMiddleware.single("file"),
			this.translateGpx,
		);
		this.app.post(
			"/track",
			this.uploadMiddleware.single("file"),
			this.saveTrack,
		);
		this.app.get("/track", this.getAllTracks);
		this.app.get("/track/:trackId", this.getTrackById);
		this.app.get("/track-metadata", this.getAllTracksMetadata);
	}

	private translateGpx = async (req: Request, res: Response) => {
		try {
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
		} catch (error) {
			console.error("Error processing file:", error);
			res.status(500).send({ error: "Internal Server Error" });
		}
	};

	private saveTrack = async (req: Request, res: Response) => {
		// TODO: Add validation for metadata and trackData
		// TODO: Pass the authorId from the JWT token
		try {
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
		} catch (error) {
			console.error("Error processing file:", error);
			res.status(500).send({ error: "Internal Server Error" });
		}
	};

	private getAllTracks = async (req: Request, res: Response) => {
		try {
			const tracks = await this.trackRepository.getAllTracks();
			res.status(200).json(tracks);
		} catch (error) {
			console.error("Error getting tracks:", error);
			res.status(500).send({ error: "Internal Server Error" });
		}
	};

	private getTrackById = async (req: Request, res: Response) => {
		try {
			const track = await this.trackRepository.getTrackById(
				req.params.trackId,
			);
			if (!track) return res.status(404).send("Track not found.");
			res.status(200).json(track);
		} catch (error) {
			console.error("Error getting track:", error);
			res.status(500).send({ error: "Internal Server Error" });
		}
	};

	private getAllTracksMetadata = async (req: Request, res: Response) => {
		try {
			const tracks = await this.trackRepository.getAllTracksMetadata();
			res.status(200).json(tracks);
		} catch (error) {
			console.error("Error getting tracks:", error);
			res.status(500).send({ error: "Internal Server Error" });
		}
	};
}
