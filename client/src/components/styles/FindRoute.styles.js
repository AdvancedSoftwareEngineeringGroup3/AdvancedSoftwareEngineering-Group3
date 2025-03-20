import { StyleSheet } from 'react-native';

const findRouteStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginBottom: 10,
  },
  label: {
    marginBottom: 10,
  },
  selected: {
    marginTop: 10,
    marginBottom: 10,
  },
  TouchableOpacity: {
    padding: 10,
    backgroundColor: '#841584',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: 'black',
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    width: '100%',
  },
  inputAndroid: {
    color: 'black',
    width: '80%',
  },
});

export { pickerSelectStyles, findRouteStyles };
