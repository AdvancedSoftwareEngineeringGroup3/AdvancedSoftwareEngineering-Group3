import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const displayRouteStyles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  routeInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    top: 60,
  },
  error: { color: 'red', textAlign: 'center', margin: 10 },
  loadingText: { textAlign: 'center', margin: 10 },
  dpadContainer: {
    position: 'absolute',
    top: '50%',
    left: '15%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
  },
  dpadRow: {
    flexDirection: 'row',
  },
  dpadButton: {
    padding: 10,
    backgroundColor: '#33CC66',
    colour: 'white',
    borderRadius: 5,
    margin: 5,
  },
  dpadtext: {
    color: 'white',
    fontWeight: 'bold',
  },
  barContainer: {
    position: 'absolute', // Position it relative to the parent container
    bottom: 0, // Align it to the bottom
    left: 0, // Align it to the left edge
    right: 0, // Align it to the right edge
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white', // Optional: Add a background color for better visibility
    padding: 10, // Optional: Add padding for spacing
    borderTopWidth: 1, // Optional: Add a border at the top
    borderColor: '#ccc', // Optional: Border color
    width: screenWidth,
    height: 10,
  },
  routeInfoContainer: {
    flex: 1,
  },
  devModeContainer: {
    left: 20,
    top: 120,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10, // Add this to curve the corners
  },
  devModeText: {
    fontSize: 16,
    marginBottom: 5,
  },
  barImage: {
    position: 'absolute',
    width: screenWidth,
    height: 190,
    left: 0,
    bottom: 0,
    zIndex: 0, // put image behind buttons
    resizeMode: 'stretch', // or 'cover' if stretch distorts
  },
});

export default displayRouteStyles;
