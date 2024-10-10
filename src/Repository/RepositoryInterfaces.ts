import { FullTrackData, TrackMetadata } from "./TrackRepositoryMemory";
import { UserDAO } from "./UserRepositoryDatabase";
import { User } from "./UserRepositoryMemory";

export interface TrackRepository {
	getAllTracks(): Array<FullTrackData>;
	getAllTracksMetadata(): Array<TrackMetadata>;
	getTrackById(id: string): FullTrackData;
	saveTrack(track: FullTrackData): string;
	deleteTrackbyTrackId(id: string): void;
}

export interface UserRepository {
	getAllUsers(): Promise<Array<UserDAO>>;
	getUserById(id: string): Promise<UserDAO>;
	getUserByEmail(email: string): Promise<UserDAO | undefined>;
	saveUser(user: User): Promise<string>;
	removeUser(id: string): Promise<void>;
}