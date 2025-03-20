import { decode } from '@googlemaps/polyline-codec';
import * as Location from 'expo-location';
import {
  requestLocationPermission,
  getCurrentLocation,
  startLocationTracking,
  decodeRoute,
  haversine,
} from '../src/utils/mapUtils'; // Update with the correct path

// Test that Haversine function returns the correct distance between two points
describe('Haversine Formula', () => {
  it('should return the correct distance between two points', () => {
    const start = { latitude: 40.7128, longitude: -74.006 };
    const end = { latitude: 34.0522, longitude: -118.2437 };
    const distance = haversine(start, end);
    expect(distance).toBeCloseTo(3935746.254609722, 0);
  });
});

// Mock polyline decoder
jest.mock('@googlemaps/polyline-codec', () => ({
  decode: jest.fn(() => [
    [0, 0],
    [1, 1],
  ]), // Mock polyline decoding
}));

// Mock expo-location module
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  Accuracy: { BestForNavigation: 'best' },
}));

// describe('extractRoutes', () => {
//   it('should return decoded routes when valid data is provided', async () => {
//     const result = await extractRoutes(response);

//     expect(decode).toHaveBeenCalledTimes(response.routes.length);
//     expect(result).toEqual(
//       response.routes.map(() => [
//         [0, 0],
//         [1, 1],
//       ]),
//     );
//   });

//   it('should return an empty array if no routes exist', async () => {
//     const result = await extractRoutes({});
//     expect(result).toEqual([]);
//   });
// });

describe('Location Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('requestLocationPermission should return true if permission is granted', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
    });

    const result = await requestLocationPermission();
    expect(result).toBe(true);
  });

  test('requestLocationPermission should return false if permission is denied', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'denied',
    });

    const result = await requestLocationPermission();
    expect(result).toBe(false);
  });

  test('getCurrentLocation should return latitude and longitude if permission is granted', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
    });
    Location.getCurrentPositionAsync.mockResolvedValueOnce({
      coords: { latitude: 40.7128, longitude: -74.006 },
    });

    const result = await getCurrentLocation();
    expect(result).toEqual({ latitude: 40.7128, longitude: -74.006 });
  });

  test('getCurrentLocation should throw an error if permission is denied', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'denied',
    });

    await expect(getCurrentLocation()).rejects.toThrow(
      'Permission to access location was denied.',
    );
  });

  test('startLocationTracking should call watchPositionAsync if permission is granted', async () => {
    const callback = jest.fn();
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
    });

    const mockWatch = jest.fn();
    Location.watchPositionAsync.mockImplementationOnce((_, onUpdate) => {
      onUpdate({ coords: { latitude: 51.5074, longitude: -0.1278 } }); // Simulate location update
      return Promise.resolve(mockWatch);
    });

    await startLocationTracking(callback);
    expect(callback).toHaveBeenCalledWith({
      latitude: 51.5074,
      longitude: -0.1278,
    });
  });

  test('startLocationTracking should throw an error if permission is denied', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'denied',
    });

    await expect(startLocationTracking(jest.fn())).rejects.toThrow(
      'Permission to access location was denied.',
    );
  });

  test('decodeRoute should correctly decode a polyline string', () => {
    const encodedPolyline = 'encodedString';
    const mockDecodedPath = [
      [40.7128, -74.006],
      [34.0522, -118.2437],
    ];
    decode.mockReturnValueOnce(mockDecodedPath);

    const result = decodeRoute(encodedPolyline);
    expect(result).toEqual([
      { latitude: 40.7128, longitude: -74.006 },
      { latitude: 34.0522, longitude: -118.2437 },
    ]);
  });
});
