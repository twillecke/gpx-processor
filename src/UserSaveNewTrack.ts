import Track, { Input } from "./Track";
import TrackRepositoryMemory from "./TrackRepository";

export default class UserSaveNewTrack {
	trackRepository: TrackRepositoryMemory;
	constructor(trackRepository: TrackRepositoryMemory) {
		this.trackRepository = trackRepository;
	}
	async execute(input: Input): Promise<string> {
		const track = await Track.execute({ metadata: input.metadata, trackData: input.trackData });
		const savedTrackId = this.trackRepository.saveTrack(track);
		return savedTrackId;
	}
}