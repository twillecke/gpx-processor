import Track, { Input } from "../../src/Domain/Track";

test("Should create Track", async () => {
	const input: Input = {
		metadata: {
			title: "Lagoinha do Leste",
			authorId: "b1c1b2b6-7d2b-4a2b-8b2b-4b2b7b2b2b2b",
			imageUrl: "./image/1.png",
			elevationGain: 670.9899999999996,
			totalDistance: 9.32,
		},
		trackData: {
			location: {
				lat: -27.77901,
				lon: -48.50634,
			},
			totalDistance: 9.32,
			segments: [
				{
					altitude: 19.1,
					distanceFromStart: 0,
					waypoint: {
						title: "Start",
					},
				},
				{
					altitude: 55.39,
					distanceFromStart: 0.19,
				},
				{
					altitude: 119.93,
					distanceFromStart: 0.57,
				},
				{
					altitude: 173.08,
					distanceFromStart: 0.91,
				},
				{
					altitude: 218.35,
					distanceFromStart: 1.19,
				},
				{
					altitude: 177.64,
					distanceFromStart: 1.44,
				},
				{
					altitude: 157.73,
					distanceFromStart: 1.57,
				},
				{
					altitude: 109.2,
					distanceFromStart: 1.78,
				},
				{
					altitude: 48.9,
					distanceFromStart: 1.94,
				},
				{
					altitude: 7.86,
					distanceFromStart: 2.04,
				},
				{
					altitude: 12.49,
					distanceFromStart: 2.25,
				},
				{
					altitude: 37.52,
					distanceFromStart: 2.39,
				},
				{
					altitude: 81.21,
					distanceFromStart: 2.47,
				},
				{
					altitude: 116.49,
					distanceFromStart: 2.54,
				},
				{
					altitude: 189.44,
					distanceFromStart: 2.68,
				},
				{
					altitude: 126.64,
					distanceFromStart: 2.92,
				},
				{
					altitude: 96.19,
					distanceFromStart: 2.98,
				},
				{
					altitude: 50.69,
					distanceFromStart: 3.05,
				},
				{
					altitude: 26.27,
					distanceFromStart: 3.13,
				},
				{
					altitude: 6.29,
					distanceFromStart: 3.43,
				},
				{
					altitude: 8.72,
					distanceFromStart: 3.98,
				},
				{
					altitude: 2.46,
					distanceFromStart: 4.42,
				},
				{
					altitude: 38.67,
					distanceFromStart: 4.79,
				},
				{
					altitude: 42.13,
					distanceFromStart: 5.14,
				},
				{
					altitude: 36.07,
					distanceFromStart: 5.64,
				},
				{
					altitude: 53.97,
					distanceFromStart: 6.12,
				},
				{
					altitude: 75.54,
					distanceFromStart: 6.59,
				},
				{
					altitude: 85.73,
					distanceFromStart: 6.99,
				},
				{
					altitude: 17.81,
					distanceFromStart: 7.47,
				},
				{
					altitude: 17.39,
					distanceFromStart: 7.96,
				},
				{
					altitude: 4.44,
					distanceFromStart: 8.21,
				},
				{
					altitude: 19.85,
					distanceFromStart: 8.58,
				},
				{
					altitude: 17.98,
					distanceFromStart: 8.65,
				},
				{
					altitude: 23.01,
					distanceFromStart: 8.71,
				},
				{
					altitude: 15.85,
					distanceFromStart: 8.79,
				},
				{
					altitude: 11.01,
					distanceFromStart: 8.84,
				},
				{
					altitude: 15.44,
					distanceFromStart: 8.91,
				},
				{
					altitude: 12.73,
					distanceFromStart: 8.99,
				},
				{
					altitude: 11.48,
					distanceFromStart: 9.08,
				},
				{
					altitude: 10.8,
					distanceFromStart: 9.32,
					waypoint: {
						title: "End",
					},
				},
			],
			elevationGain: 670.9899999999996,
			elevationLoss: -679.87,
		},
	};
	const track = await Track.create(input);

	expect(track.metadata.trackId).toBeTruthy();
	expect(track.metadata.createdAt).toBeTruthy();
	expect(track.metadata.title).toBe(input.metadata.title);
	expect(track.metadata.authorId).toBe(input.metadata.authorId);
	expect(track.metadata.imageUrl).toBe(input.metadata.imageUrl);
	expect(track.trackData.location).toEqual({
		lat: -27.77901,
		lon: -48.50634,
	});
	expect(track.trackData.totalDistance).toBe(9.32);
	expect(track.trackData.segments).toHaveLength(40);
});
