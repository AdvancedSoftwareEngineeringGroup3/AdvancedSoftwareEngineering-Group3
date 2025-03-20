import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  storeData,
  retrieveData,
  removeData,
  updateData,
} from '../src/caching';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

const testData = {
  one: 1,
  two: '2',
};

const changedData = { one: 11 };

test('stores data to cache', async () => {
  //   expect(await storeData("tester", testData)).toBe(0);

  await storeData('tester', testData);

  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    JSON.stringify('tester'),
    JSON.stringify(testData),
  );
});

test('retrieves data from cache', async () => {
  const result = await retrieveData('tester', testData);

  expect(AsyncStorage.getItem).toHaveBeenCalledWith(JSON.stringify('tester'));
  expect(result).toEqual(testData);
});

test('updates data in cache', async () => {
  await updateData('tester', changedData);

  expect(AsyncStorage.mergeItem).toHaveBeenCalledWith(
    JSON.stringify('tester'),
    JSON.stringify(changedData),
  );
});

test('remove data from cache', async () => {
  await removeData('tester');
  expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
    JSON.stringify('tester'),
  );
});

test('handles errors when storing data to cache', async () => {
  AsyncStorage.setItem.mockRejectedValueOnce(
    new Error('Error storing data in cache'),
  );

  console.error = jest.fn();

  await storeData('tester', testData);

  expect(console.error).toHaveBeenCalledWith('Error storing data in cache');
});

test('handles errors when retrieveing data from cache', async () => {
  AsyncStorage.getItem.mockRejectedValueOnce(
    new Error('Error retrieving data from cache'),
  );

  console.error = jest.fn();

  await retrieveData('tester');

  expect(console.error).toHaveBeenCalledWith(
    'Error retrieving data from cache',
  );
});

// // TODO: finish
// test('handles errors when updating data in cache', async () => {
//     AsyncStorage.mergeItem.mockRejectedValueOnce(new Error('Error updating data in cache'));

//     console.error = jest.fn();

//     await updateData("tester", changedData);

//     expect(console.error).toHaveBeenCalledWith('Error updating data in cache');
// });

// TODO: write remove function
// test('handles errors when updating data in cache', async () => {
//     // AsyncStorage.getItem.mockRejectedValueOnce(new Error('Error retrieving data from cache'));

//     console.error = jest.fn();

//     await retrieveData("test");

//     expect(console.error).toHaveBeenCalledWith('Error retrieving data from cache');
// });
