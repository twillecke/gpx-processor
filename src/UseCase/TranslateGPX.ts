import { Gpx, parseGpx } from "practical-gpx-to-js";

type Segment = {
	altitude: number | null;
	distanceFromStart: string | null | number;
	waypoint?: Waypoint;
};

type Waypoint = {
	title: string;
	description?: string;
};

type Coordinates = {
  lat: number;
  lon: number;
};

export type ProcessedGPX = {
	location: Coordinates | null;
	totalDistance: number;
	segments: Array<Segment>; // array of trackpoints to generate distance x elevation graph
	elevationGain: number; // how much you climb in total not counting descents
	elevationLoss: number; // how much you descend in total not counting climbs
};

export default class TranslateGPX {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	public static async execute(input: any): Promise<ProcessedGPX> {
		const parsedGpx = await parseGpx(input);
		const totalDistance = (
			this.calculateTotalDistance(parsedGpx) / 1000
		).toFixed(2); // returns distance in kilometers
		const trackPoints = this.calculateDistanceAndElevation(parsedGpx); // returns array of objects with distance from start and altitude
		const elevations = this.calculateElevations(parsedGpx);
		const output: ProcessedGPX = {
			location: this.getValidLocationCoordinates(parsedGpx),
			totalDistance: parseFloat(totalDistance),
			segments: this.sampleArrayAtIntervals(trackPoints ?? [], 40),
			elevationGain: elevations.elevationGain,
			elevationLoss: elevations.elevationLoss,
		};
		return output;
	}

	private static getValidLocationCoordinates(gpx: Gpx, track = 0): Coordinates | null{
		if (gpx.tracks?.[track]?.trackpoints) {
			for (let i = 0; i < gpx.tracks[track].trackpoints.length - 1; i++) {
				if (
					gpx.tracks[track].trackpoints[i].lat &&
					gpx.tracks[track].trackpoints[i].lon
				) {
					return {
						lat: gpx.tracks[track].trackpoints[i].lat,
						lon: gpx.tracks[track].trackpoints[i].lon,
					};
				}
			}
		}
    return null;
	}

	private static calculateTotalDistance(gpx: Gpx, track = 0): number {
		let totalDistance = 0;
		if (gpx.tracks?.[track]?.trackpoints) {
			for (let i = 0; i < gpx.tracks[track].trackpoints.length - 1; i++) {
				const lat1 = gpx.tracks[track].trackpoints[i].lat;
				const lon1 = gpx.tracks[track].trackpoints[i].lon;
				const lat2 = gpx.tracks[track].trackpoints[i + 1].lat;
				const lon2 = gpx.tracks[track].trackpoints[i + 1].lon;
				totalDistance += this.calculateHaversineDistance(
					lat1,
					lon1,
					lat2,
					lon2,
				);
			}
		}
		return totalDistance;
	}

	private static calculateHaversineDistance(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number,
	) {
		const R = 6371e3; // Earth radius in meters
		const toRadians = (angle: number) => angle * (Math.PI / 180);
		const φ1 = toRadians(lat1);
		const φ2 = toRadians(lat2);
		const Δφ = toRadians(lat2 - lat1);
		const Δλ = toRadians(lon2 - lon1);
		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // in meters
	}

	private static calculateDistanceAndElevation(
		gpx: Gpx,
		track = 0,
	): Array<Segment> {
		const result: Array<{
			altitude: number | null;
			distanceFromStart: string | null | number;
		}> = [];
		if (gpx.tracks?.[track]?.trackpoints) {
			let totalDistance = 0;
			for (let i = 0; i < gpx.tracks[track].trackpoints.length - 1; i++) {
				const lat1 = gpx.tracks[track].trackpoints[i].lat;
				const lon1 = gpx.tracks[track].trackpoints[i].lon;
				const lat2 = gpx.tracks[track].trackpoints[i + 1].lat;
				const lon2 = gpx.tracks[track].trackpoints[i + 1].lon;
				const currentDistance =
					this.calculateHaversineDistance(lat1, lon1, lat2, lon2) /
					1000; // convert to kilometers
				totalDistance += currentDistance;
				let currentAltitude =
					gpx.tracks[track].trackpoints[i + 1].altitude;
				if (!currentAltitude)
					currentAltitude = gpx.tracks[track].trackpoints[i].altitude;
				result.push({
					altitude: currentAltitude,
					distanceFromStart: parseFloat(totalDistance.toFixed(2)),
				});
			}
			return result;
		}
		return result;
	}

	private static calculateElevations(
		gpx: Gpx,
		track = 0,
	): { elevationGain: number; elevationLoss: number } {
		let elevationGain = 0;
		let elevationLoss = 0;
		if (gpx.tracks?.[track]?.trackpoints) {
			for (let i = 0; i < gpx.tracks[track].trackpoints.length - 1; i++) {
				const currentAltitude =
					gpx.tracks[track].trackpoints[i].altitude;
				const nextAltitude =
					gpx.tracks[track].trackpoints[i + 1].altitude;
				if (
					currentAltitude &&
					nextAltitude &&
					nextAltitude > currentAltitude
				) {
					elevationGain += nextAltitude - currentAltitude;
				}
				if (
					currentAltitude &&
					nextAltitude &&
					nextAltitude < currentAltitude
				) {
					elevationLoss -= currentAltitude - nextAltitude;
				}
			}
		}
		return { elevationGain: elevationGain, elevationLoss: elevationLoss };
	}

	private static sampleArrayAtIntervals(
		array: Array<Segment>,
		sampleSize: number,
	) {
		if (array.length === 0) return [];
		const interval = Math.ceil(array.length / sampleSize);
		const sampledArray = [];
		for (let i = 0; i < array.length; i += interval) {
			sampledArray.push(array[i]);
		}
		// Ensure the last element is included if it's not already
		if (sampledArray[sampledArray.length - 1] !== array[array.length - 1]) {
			sampledArray.push(array[array.length - 1]);
		}
		// add waypoint to first and last element
		sampledArray[0].waypoint = { title: "Start" };
		sampledArray[sampledArray.length - 1].waypoint = { title: "End" };
		return sampledArray;
	}
}
