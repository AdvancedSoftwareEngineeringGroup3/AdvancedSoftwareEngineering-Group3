import { StyleSheet } from 'react-native';

const susDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lineChart: {
    position: 'absolute',
    bottom: 40,
    right: '0%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  image: {
    width: 300, 
    height: 400, 
    resizeMode: 'contain', 
  },
  monthButton: {
    position: 'absolute',
    bottom: 15,
    left: '80%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  yearButton: {
    position: 'absolute',
    bottom: 15,
    left: '20%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default susDashboardStyles;
