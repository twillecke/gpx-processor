import { TrackMetadata } from "../Repository/TrackRepositoryMemory";
import { ProcessedGPX } from "../UseCase/TranslateGPX";
import crypto from "crypto";

type FormMetadata = {
	title: string;
	authorId: string;
	imageUrl?: string;
};

export type Input = {
	metadata: FormMetadata;
	trackData: ProcessedGPX;
};

export default class Track {
	metadata: TrackMetadata;
	trackData: ProcessedGPX;

	constructor(metadata: TrackMetadata, trackData: ProcessedGPX) {
		this.metadata = metadata;
		this.trackData = trackData;
	}

	static async create(input: Input): Promise<Track> {
		const metadata: TrackMetadata = {
			trackId: crypto.randomUUID(),
			createdAt: new Date(),
			...input.metadata,
		};
		return new Track(metadata, input.trackData);
	}
}
