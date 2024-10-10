import * as dotenv from "dotenv";
import express from "express";
import TrackRepositoryMemory from "./Repository/TrackRepositoryMemory";
import APIController, { APIControllerDependencies } from "./APIController";
import multer from "multer";
import CheckEnvironmentVariables from "./CheckEnvironmentVariables";
import { ResponseErrorHandler } from "./ResponseErrorHandler";
import UserRepositoryMemory from "./Repository/UserRepositoryMemory";
import UserRepositoryDatabase from "./Repository/UserRepositoryDatabase";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";

const cors = require("cors");
const compression = require("compression");
dotenv.config();

CheckEnvironmentVariables.execute();
const app = express();
app.use(express.json());
app.use(compression());
app.use(cors());
app.use(ResponseErrorHandler);
const connection = new PgPromiseAdapter();
const apiControllerDependencies: APIControllerDependencies = {
	uploadMiddleware: multer(),
	trackRepository: new TrackRepositoryMemory(),
	// userRepository: new UserRepositoryMemory(),
	userRepository: new UserRepositoryDatabase(connection)
};
new APIController(app, apiControllerDependencies);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
