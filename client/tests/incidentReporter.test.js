import { postIncident } from '../src/utils/incidentReporterUtils';

global.fetch = jest.fn();
global.alert = jest.fn();

jest.mock('react-native', () => ({
  Platform: { OS: 'android' }, // Mock Platform to avoid runtime issues
}));

describe('postIncident', () => {
  const mockIncidentData = {
    type: 'accident',
    title: 'Accident',
    comment: 'Test comment',
    timestamp: '2025-03-28T12:00:00Z',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  };
  const mockBaseUrl = 'http://mockserver.local';

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return data on successful response', async () => {
    const mockResponse = { message: 'Incident reported successfully' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await postIncident(mockIncidentData, mockBaseUrl);

    expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/reportIncident`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockIncidentData),
    });
    expect(result).toEqual(mockResponse);
    expect(global.alert).toHaveBeenCalledWith(mockResponse.message);
  });

  it('should throw an error on failed response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(postIncident(mockIncidentData, mockBaseUrl)).rejects.toThrow(
      'HTTP error! status: 500',
    );

    expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/reportIncident`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockIncidentData),
    });
  });

  it('should log an error on exception', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(postIncident(mockIncidentData, mockBaseUrl)).rejects.toThrow(
      'Network error',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error details:',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });

  it('should use the default base URL if customBaseUrl is not provided', async () => {
    const mockResponse = { message: 'Incident reported successfully' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    process.env.EXPO_PUBLIC_API_URL = 'http://defaultserver.local';

    const result = await postIncident(mockIncidentData);

    expect(fetch).toHaveBeenCalledWith(
      'http://defaultserver.local/reportIncident',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockIncidentData),
      },
    );
    expect(result).toEqual(mockResponse);
    expect(global.alert).toHaveBeenCalledWith(mockResponse.message);
  });
});
