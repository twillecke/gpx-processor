import Track, { Input } from "../Domain/Track";
import TrackRepositoryMemory from "../Repository/TrackRepository";

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