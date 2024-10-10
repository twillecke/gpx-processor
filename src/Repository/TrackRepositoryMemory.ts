import Track from "../Domain/Track";
import { ProcessedGPX } from "../UseCase/TranslateGPX";
import { TrackRepository } from "./RepositoryInterfaces";

export type FullTrackData = {
	metadata: TrackMetadata;
	trackData: ProcessedGPX;
};

export type TrackMetadata = {
	trackId: string;
	title: string;
	authorId: string;
	imageUrl?: string;
	createdAt: Date;
	totalDistance?: number;
	elevationGain?: number;
};

export default class TrackRepositoryMemory implements TrackRepository {
	private tracks: Array<FullTrackData> = [];

	async getAllTracks(): Promise<Array<FullTrackData>> {
		return this.tracks;
	}

	async getAllTracksMetadata(): Promise<Array<TrackMetadata>> {
		return this.tracks.map((track) => track.metadata);
	}

	async getTrackById(id: string): Promise<FullTrackData> {
		const track = this.tracks.find(
			(track) => track.metadata.trackId === id,
		);
		if (!track) {
			throw new Error("Track not found");
		}
		return track;
	}

	async saveTrack(track: Track): Promise<string> {
		this.tracks.push(track);
		return track.metadata.trackId;
	}

	async deleteTrackbyTrackId(id: string): Promise<void> {
		this.tracks = this.tracks.filter(
			(track) => track.metadata.trackId !== id,
		);
	}
}
