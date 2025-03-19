import { StyleSheet } from 'react-native';

const displayRouteStyles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  routeInfo: { fontSize: 16 },
  error: { color: 'red', textAlign: 'center', margin: 10 },
  loadingText: { textAlign: 'center', margin: 10 },
  dpadContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
  },
  dpadRow: {
    flexDirection: 'row',
  },
  dpadButton: {
    padding: 10,
    backgroundColor: '#ADD8E6',
    borderRadius: 5,
    margin: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  routeInfoContainer: {
    flex: 1,
  },
  devModeContainer: {
    alignItems: 'center',
  },
  devModeText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default displayRouteStyles;
