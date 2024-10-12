import type { TrackMetadataDAO } from "./TrackRepositoryDatabase";
import type { FullTrackData } from "./TrackRepositoryMemory";
import type { UserDAO } from "./UserRepositoryDatabase";
import type { User } from "./UserRepositoryMemory";

export interface TrackRepository {
	getAllTracks(): Promise<Array<FullTrackData>>;
	getAllTracksMetadata(): Promise<Array<TrackMetadataDAO>>;
	getTrackById(id: string): Promise<FullTrackData>;
	saveTrack(track: FullTrackData): Promise<string>;
	deleteTrackbyTrackId(id: string): Promise<void>;
}

export interface UserRepository {
	getAllUsers(): Promise<Array<UserDAO>>;
	getUserById(id: string): Promise<UserDAO>;
	getUserByEmail(email: string): Promise<UserDAO | undefined>;
	saveUser(user: User): Promise<string>;
	removeUser(id: string): Promise<void>;
}
