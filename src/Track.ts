import { TrackMetadata } from "./TrackRepository";
import { ProcessedGPX } from "./TranslateGPX";
import crypto from "crypto";

type FormMetadata = {
	title: string;
	author: string;
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

	static async execute(input: Input): Promise<Track> {
		const metadata: TrackMetadata = {
			trackId: crypto.randomUUID(),
			createdAt: new Date(),
			...input.metadata,
		};
		return new Track(metadata, input.trackData);
	}
}
