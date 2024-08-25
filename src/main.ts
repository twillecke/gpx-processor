import * as dotenv from "dotenv";
import express from "express";
import TrackRepositoryMemory from "./Repository/TrackRepositoryMemory";
import APIController, { APIControllerDependencies } from "./APIController";
import multer from "multer";
import CheckEnvironmentVariables from "./CheckEnvironmentVariables";
const cors = require("cors");
const compression = require("compression");
dotenv.config();

CheckEnvironmentVariables.execute();
const app = express();
app.use(express.json());
app.use(compression());
app.use(cors());
const apiControllerDependencies: APIControllerDependencies = {
	uploadMiddleware: multer(),
	trackRepository: new TrackRepositoryMemory(),
};
new APIController(app, apiControllerDependencies);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
