import { Gpx, GpxWaypoint, parseGpx } from 'practical-gpx-to-js';
import * as fs from 'fs';
import * as path from 'path';

type Segment = { altitude: number | null; distanceFromStart: string | null | number };

type ProcessedGPX = {
  totalDistance: number;
  segments: Array<Segment>; // array of trackpoints to generate distance x elevation graph
  elevationGain: number; // how much you climb in total not counting descents
  elevationLoss: number; // how much you descend in total not counting climbs
  waypoints?: Array<GpxWaypoint>; // array of points of interest to add relevant info
};

async function main() {
  const result = await translateGPXtoJson('Austria.gpx');
  console.log(result);
}

async function processGpx(fileName: string) {
  const gpxString = fs.readFileSync(path.join(__dirname, fileName), {
    encoding: 'utf8',
  });
  const gpx = await parseGpx(gpxString);
  return gpx;
}

async function translateGPXtoJson(filename: string) {
  const gpx = await processGpx(filename);
  const totalDistance = (calculateTotalDistance(gpx) / 1000).toFixed(2); // returns distance in kilometers
  const trackPoints = calculateDistanceAndElevation(gpx); // returns array of objects with distance from start and altitude
  const elevations = calculateElevations(gpx);
  const result: ProcessedGPX = {
    totalDistance: parseFloat(totalDistance),
    segments: sampleArrayAtIntervals(trackPoints ?? [], 40),
    elevationGain: elevations.elevationGain,
    elevationLoss: elevations.elevationLoss,
  };
  return result;
}

function getLatLong(gpx: Gpx, track = 0) {
  if (gpx.tracks) {
    gpx.tracks[track].trackpoints.forEach((trackpoint) => {
      console.log(`lat: ${trackpoint.lat} long: ${trackpoint.lon}`);
    });
  }
}

function getAltitudes(gpx: Gpx, track = 0) {
  if (gpx.tracks) {
    // extract altitude from all trackpoints of the first track
    gpx.tracks[track].trackpoints.forEach((trackpoint) => {
      console.log(`altitude: ${trackpoint.altitude}`);
    });
  }
}

async function gpxToJson(gpx: ProcessedGPX, filename: string) {
  const parseGpx = JSON.stringify(gpx);
  fs.writeFileSync(path.join(__dirname, filename), parseGpx);
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const toRadians = (angle: number) => angle * (Math.PI / 180);

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

function calculateTotalDistance(gpx: Gpx, track = 0): number {
  let totalDistance = 0;
  if (gpx.tracks?.[track]?.trackpoints) {
    for (let i = 0; i < gpx.tracks[track].trackpoints.length - 1; i++) {
      const lat1 = gpx.tracks[track].trackpoints[i].lat;
      const lon1 = gpx.tracks[track].trackpoints[i].lon;
      const lat2 = gpx.tracks[track].trackpoints[i + 1].lat;
      const lon2 = gpx.tracks[track].trackpoints[i + 1].lon;
      totalDistance += haversineDistance(lat1, lon1, lat2, lon2);
    }
  }
  return totalDistance;
}

function calculateDistanceAndElevation(gpx: Gpx, track = 0): Array<Segment> {
  const result: Array<{ altitude: number | null; distanceFromStart: string | null | number }> = [];
  if (gpx.tracks?.[track]?.trackpoints) {
    let totalDistance = 0;
    for (let i = 0; i < gpx.tracks[track].trackpoints.length - 1; i++) {
      const lat1 = gpx.tracks[track].trackpoints[i].lat;
      const lon1 = gpx.tracks[track].trackpoints[i].lon;
      const lat2 = gpx.tracks[track].trackpoints[i + 1].lat;
      const lon2 = gpx.tracks[track].trackpoints[i + 1].lon;

      const currentDistance = haversineDistance(lat1, lon1, lat2, lon2) / 1000; // convert to kilometers
      totalDistance += currentDistance;

      let currentAltitude = gpx.tracks[track].trackpoints[i + 1].altitude;
      if (!currentAltitude) currentAltitude = gpx.tracks[track].trackpoints[i].altitude;

      result.push({ altitude: currentAltitude, distanceFromStart: parseFloat(totalDistance.toFixed(2)) });
    }
    return result;
  }
  return result;
}

function calculateElevations(gpx: Gpx, track = 0): { elevationGain: number; elevationLoss: number } {
  let elevationGain = 0;
  let elevationLoss = 0;
  if (gpx.tracks?.[track]?.trackpoints) {
    for (let i = 0; i < gpx.tracks[track].trackpoints.length - 1; i++) {
      const currentAltitude = gpx.tracks[track].trackpoints[i].altitude;
      const nextAltitude = gpx.tracks[track].trackpoints[i + 1].altitude;
      if (currentAltitude && nextAltitude && nextAltitude > currentAltitude) {
        elevationGain += nextAltitude - currentAltitude;
      }
      if (currentAltitude && nextAltitude && nextAltitude < currentAltitude) {
        elevationLoss -= currentAltitude - nextAltitude;
      }
    }
  }
  return { elevationGain: elevationGain, elevationLoss: elevationLoss };
}

function sampleArrayAtIntervals(array: Array<Segment>, sampleSize: number) {
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

  return sampledArray;
}

main();
