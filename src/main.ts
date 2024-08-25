import * as dotenv from "dotenv";
import express from "express";
import TrackRepositoryMemory from "./Repository/TrackRepositoryMemory";
import APIController from "./APIController";
import multer from "multer";
const cors = require("cors");
const compression = require("compression");

dotenv.config();
const app = express();
app.use(express.json());
app.use(compression());
app.use(cors());
const uploadMiddleware = multer();
const trackRepository = new TrackRepositoryMemory();
new APIController(app, { trackRepository, uploadMiddleware });

app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
