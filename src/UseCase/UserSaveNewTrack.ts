import Track, { type Input } from "../Domain/Track";
import type { TrackRepository } from "../Repository/RepositoryInterfaces";

export default class UserSaveNewTrack {
	trackRepository: TrackRepository;
	constructor(trackRepository: TrackRepository) {
		this.trackRepository = trackRepository;
	}
	async execute(input: Input): Promise<string> {
		const track = await Track.create({
			metadata: input.metadata,
			trackData: input.trackData,
		});
		const savedTrackId = this.trackRepository.saveTrack(track);
		return savedTrackId;
	}
}
