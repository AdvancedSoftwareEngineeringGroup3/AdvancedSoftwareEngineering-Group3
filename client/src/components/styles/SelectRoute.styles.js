import { StyleSheet } from 'react-native';

const selectRouteStyles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  routeButton: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  startButton: {
    padding: 10,
    backgroundColor: '#ADD8E6',
    borderRadius: 5,
  },
  error: { color: 'red', textAlign: 'center', margin: 10 },
  loadingText: { textAlign: 'center', margin: 10 },
});

export default selectRouteStyles;
