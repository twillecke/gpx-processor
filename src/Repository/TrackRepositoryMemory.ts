import type Track from "../Domain/Track";
import type { ProcessedGPX } from "../UseCase/TranslateGPX";
import type { TrackRepository } from "./RepositoryInterfaces";
import type { TrackMetadataDAO } from "./TrackRepositoryDatabase";

export type FullTrackData = {
	metadata: TrackMetadata;
	trackData: ProcessedGPX;
};

export type TrackMetadata = {
	location?: string;
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

	async getAllTracksMetadata(): Promise<Array<TrackMetadataDAO>> {
		const tracksMetadata = this.tracks.map((track) => {
			return {
				trackId: track.metadata.trackId,
				created_at: track.metadata.createdAt.toISOString(),
				title: track.metadata.title,
				author_id: track.metadata.authorId,
				image_url: track.metadata.imageUrl,
				location: track.metadata.location,
				total_distance: track.metadata.totalDistance,
				elevation_gain: track.metadata.elevationGain,
			};
		});
		return tracksMetadata;
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
