import * as dotenv from "dotenv";
import express from "express";
import multer from "multer";
import TranslateGPX from "./UseCase/TranslateGPX";
import UserRepositoryMemory from "./Repository/UserRepositoryMemory";
import TrackRepositoryMemory from "./Repository/TrackRepositoryMemory";
import UserSaveNewTrack from "./UseCase/UserSaveNewTrack";
const cors = require("cors");
const compression = require("compression");

dotenv.config();
const app = express();
app.use(express.json());
app.use(compression());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/translate-gpx", upload.single("file"), async (req, res) => {
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
});

app.post("/track", upload.single("file"), async (req, res) => {
  // TODO: Add validation for metadata and trackData
  // TODO: Pass the authorId from the JWT token
	try {
		const input = {
			metadata: req.body.metadata,
			trackData: req.body.trackData,
		};
		if (!input.metadata || !input.trackData)
			return res.status(400).send("Invalid input.");
		const trackRepository = new TrackRepositoryMemory();
		const userSaveNewTrack = new UserSaveNewTrack(trackRepository);
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
});

app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
