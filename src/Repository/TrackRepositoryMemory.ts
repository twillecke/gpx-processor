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

	deleteTrackbyTrackId(id: string): void {
		this.tracks = this.tracks.filter(
			(track) => track.metadata.trackId !== id,
		);
	}
}
