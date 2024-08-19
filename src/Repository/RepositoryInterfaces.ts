import { FullTrackData, TrackMetadata } from "./TrackRepositoryMemory";
import { User } from "./UserRepositoryMemory";

export interface TrackRepository {
	getAllTracks(): Array<FullTrackData>;
	getAllTracksMetadata(): Array<TrackMetadata>;
	getTrackById(id: string): FullTrackData;
	saveTrack(track: FullTrackData): void;
	removeTrack(id: string): void;
}

export interface UserRepository {
	getUser(id: string): Promise<User>;
	saveUser(user: User): Promise<string>;
	removeUser(id: string): Promise<void>;
}