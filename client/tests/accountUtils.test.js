import { postConnection } from '../src/utils/accountUtils';

global.fetch = jest.fn();
global.alert = jest.fn();

jest.mock('react-native', () => ({
  Platform: { OS: 'android' }, // Mock Platform to avoid runtime issues
}));

describe('postConnection', () => {
  const mockUrl = 'testEndpoint';
  const mockPayload = { key: 'value' };
  const mockBaseUrl = 'http://mockserver.local';

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return data on successful response', async () => {
    const mockResponse = { message: 'Success' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await postConnection(mockUrl, mockPayload, mockBaseUrl);

    expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/${mockUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayload),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on failed response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(
      postConnection(mockUrl, mockPayload, mockBaseUrl),
    ).rejects.toThrow('HTTP error! status: 500');

    expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/${mockUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayload),
    });
  });

  it('should log an error on exception', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(
      postConnection(mockUrl, mockPayload, mockBaseUrl),
    ).rejects.toThrow('Network error');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error details:',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });
});
