import {AsyncStorage} from 'react-native';

_storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(
    JSON.stringify(key),
    JSON.stringify(data),
    );
  } catch (error) {
  console.error('Error storing data in cache')
  }
};

_retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(JSON.stringify(key));
    if (value !== null) {
      console.log(value);
      return value;
    }
  } catch (error) {
    console.error('Error retrieving data from cache')
  }
};

_removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(JSON.stringify(key));
    console.log('Removed successfully');
  } catch {
    console.error('Error removing data from cache')
  }
};

_updateData = async (key, changedData) => {
  try {
    AsyncStorage.mergeItem(
      JSON.stringify(key),
      JSON.stringify(changedData),
      // () => {
        _retrieveData(key)
      // },
    );
  } catch (error) {
    console.error('Error updating data in cache')
  }
};

// let UID123_object = {
//   name: 'Chris',
//   age: 30,
/*
weekly emisions

{
  "sustScore": 0,
  "distanceTravelledPerVehicle": { // running total
    "bus": 0,
    "car": 0,
    "luas": 0,
    "train": 0,
    "bike": 0,
    "walking": 0
  },
  "last7daysEmmisions": { // at midnight, each day gets replaced by the day value before it. today replaced with 0
    "today": 0,
    "t-1": 0,
    "t-2": 0,
    "t-3": 0,
    "t-4": 0,
    "t-5": 0,
    "t-6": 0
  },
  "lastYear": { // at mifnight each days total added to it's month, at new month reset to 0
    "jan": 0,
    "feb": 0,
    "mar": 0,
    "apr": 0,
    "may": 0,
    "jun": 0,
    "jul": 0,
    "aug": 0,
    "sep": 0,
    "oct": 0,
    "nov": 0,
    "dec": 0
  }
}

  */
//   traits: {hair: 'brown', eyes: 'brown'},
// };
// // You only need to define what will be added or updated
// let UID123_delta = {
//   age: 31,
//   traits: {eyes: 'blue', shoe_size: 10},
// };

AsyncStorage.setItem(
  'UID123',
  JSON.stringify(UID123_object),
  () => {
    AsyncStorage.mergeItem(
      'UID123',
      JSON.stringify(UID123_delta),
      () => {
        AsyncStorage.getItem('UID123', (err, result) => {
          console.log(result);
        });
      },
    );
  },
);
  
  // Console log result:
  // => {'name':'Chris','age':31,'traits':
  //    {'shoe_size':10,'hair':'brown','eyes':'blue'}}