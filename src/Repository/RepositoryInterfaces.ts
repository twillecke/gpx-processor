import { FullTrackData, TrackMetadata } from "./TrackRepositoryMemory";
import { User } from "./UserRepositoryMemory";

export interface TrackRepository {
	getAllTracks(): Array<FullTrackData>;
	getAllTracksMetadata(): Array<TrackMetadata>;
	getTrackById(id: string): FullTrackData;
	saveTrack(track: FullTrackData): string;
	removeTrack(id: string): void;
}

export interface UserRepository {
	getUserById(id: string): Promise<User>;
	getUserByEmail(email: string): Promise<User | undefined>;
	saveUser(user: User): Promise<string>;
	removeUser(id: string): Promise<void>;
}