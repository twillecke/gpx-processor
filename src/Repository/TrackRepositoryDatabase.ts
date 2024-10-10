import DataBaseConnection from "../infra/database/DatabaseConnection";
import { TrackRepository } from "./RepositoryInterfaces";
import { FullTrackData } from "./TrackRepositoryMemory";

export type TrackMetadataDAO = {
	trail_id: string;
	created_at: string;
	title: string;
	author_id: string;
	image_url: string;
	location: string;
	total_distance: number;
	elevation_gain: number;
};

export default class TrackRepositoryDatabase implements TrackRepository {
	constructor(readonly connection: DataBaseConnection) {}

	async getAllTracks(): Promise<FullTrackData[]> {
		throw new Error("Method not implemented.");
	}
	async getAllTracksMetadata(): Promise<TrackMetadataDAO[]> {
		const tracksMetadata = await this.connection.query(
			"SELECT * FROM trail_metadata",
			[],
		);
		if (!tracksMetadata || tracksMetadata.length < 1) return [];
		tracksMetadata.map((track: TrackMetadataDAO) => {
			track.elevation_gain = +track.elevation_gain;
			track.total_distance = +track.total_distance;
		});
		return tracksMetadata;
	}
	async getTrackById(id: string): Promise<FullTrackData> {
		const [track] = await this.connection.query(
			` SELECT 
            m.*, 
            d.track_info 
        FROM 
            trail_metadata m
        JOIN 
            trail_data d ON m.track_id = d.track_id
        WHERE 
            m.track_id = $1`,
			[id],
		);
		const fullTrackData = {
			metadata: {
				trackId: track.track_id,
				createdAt: track.created_at,
				title: track.title,
				authorId: track.author_id,
				imageUrl: track.image_url,
				totalDistance: +track.total_distance,
				elevationGain: +track.elevation_gain,
				location: track.location,
			},
			trackData: track.track_info,
		};
		return fullTrackData;
	}
	async saveTrack(track: FullTrackData): Promise<string> {
		const { metadata, trackData } = track;
		const {
			trackId,
			createdAt,
			title,
			authorId,
			imageUrl,
			totalDistance,
			elevationGain,
			location,
		} = metadata;
		await this.connection.query(
			` INSERT INTO trail_metadata 
			(track_id, created_at, title, author_id, image_url, total_distance, elevation_gain, location) 
		VALUES 
			($1, $2, $3, $4, $5, $6, $7, $8)`,
			[
				trackId,
				createdAt,
				title,
				authorId,
				imageUrl,
				totalDistance,
				elevationGain,
				location,
			],
		);
		await this.connection.query(
			` INSERT INTO trail_data 
			(track_id, track_info) 
		VALUES 
			($1, $2)`,
			[trackId, trackData],
		);
		return trackId;
	}
	async deleteTrackbyTrackId(id: string): Promise<void> {
		await this.connection.query(
			` DELETE FROM trail_metadata WHERE track_id = $1`,
			[id],
		);
		await this.connection.query(
			` DELETE FROM trail_data WHERE track_id = $1`,
			[id],
		);
	}
}
