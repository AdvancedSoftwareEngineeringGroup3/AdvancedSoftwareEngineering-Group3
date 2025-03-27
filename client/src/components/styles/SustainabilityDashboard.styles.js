import { StyleSheet } from 'react-native';

const susDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Outer container background
  },
  scrollContent: {
    alignItems: 'center', // Center align inner content
    paddingVertical: 20, // Add vertical padding
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20, // Add spacing below the score section
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '90%',
  },
  gridItem: {
    width: '45%', 
    alignItems: 'center',
    marginBottom: 20,
  },
  gridImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  gridLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartContainer: {
    marginBottom: 30, // Add spacing below each chart
  },
  lineChart: {
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-between',
    width: '80%', // Adjust button container width
    marginTop: 20,
  },
  monthButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  yearButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default susDashboardStyles;