import Track from "./Track";
import { ProcessedGPX } from "./TranslateGPX";

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
};

interface TrackRepository {
	getAllTracks(): Array<FullTrackData>;
	getAllTracksMetadata(): Array<TrackMetadata>;
	getTrackById(id: string): FullTrackData;
	saveTrack(track: FullTrackData): void;
	removeTrack(id: string): void;
}

export default class TrackRepositoryMemory implements TrackRepository {
	private tracks: Array<FullTrackData> = [];

	getAllTracks(): Array<FullTrackData> {
		return this.tracks;
	}

	getAllTracksMetadata(): Array<TrackMetadata> {
		return this.tracks.map((track) => track.metadata);
	}

	getTrackById(id: string): FullTrackData {
		const track = this.tracks.find(
			(track) => track.metadata.trackId === id,
		);
		if (!track) {
			throw new Error("Track not found");
		}
		return track;
	}

	saveTrack(track: Track): string {
		this.tracks.push(track);
		return track.metadata.trackId;
	}

	removeTrack(id: string): void {
		this.tracks = this.tracks.filter(
			(track) => track.metadata.trackId !== id,
		);
	}
}
