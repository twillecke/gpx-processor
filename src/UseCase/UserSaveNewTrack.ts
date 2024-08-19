import Track, { Input } from "../Domain/Track";
import TrackRepositoryMemory from "../Repository/TrackRepositoryMemory";

export default class UserSaveNewTrack {
	trackRepository: TrackRepositoryMemory;
	constructor(trackRepository: TrackRepositoryMemory) {
		this.trackRepository = trackRepository;
	}
	async execute(input: Input): Promise<string> {
		// TODO: in future get authorId from a JWT token to avoid spoofing
		const track = await Track.create({ metadata: input.metadata, trackData: input.trackData });
		const savedTrackId = this.trackRepository.saveTrack(track);
		return savedTrackId;
	}
}