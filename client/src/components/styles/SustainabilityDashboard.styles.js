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
  rankingsHeader: {
    flexDirection: 'row', // Arrange columns in a row
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    fontWeight: 'bold',
    paddingBottom: 5,
    marginBottom: 10,
  },
  rankingsContainer: {
    backgroundColor: '#EADABB', // Brown background
    borderRadius: 10, // Curved corners
    padding: 10,
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
    maxHeight: 250, // Limit height to make it scrollable
  },
  rankingsItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
  rankingsRow: {
    flexDirection: 'row', // Arrange columns in a row
    alignItems: 'center',
  },
  rankColumn: {
    flex: 1, // Small column for rank
    fontSize: 16,
    fontWeight: 'bold',
    color: '#231F20', // White text for contrast
    textAlign: 'center',
  },
  iconColumn: {
    flex: 1, // Small column for icon
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  nameHeader: {
    flex: 3, // Small column for icon
    width: 30,
    height: 30,
    fontSize: 16,
    fontWeight: 'bold',
    resizeMode: 'contain',
    textAlign: 'left',
    paddingTop: 5,
  },
  nameColumn: {
    flex: 3, // Larger column for name and score
    fontSize: 16,
    color: '#231F20', // White text for contrast
    paddingLeft: 10,
  },
  scoreColumn: {
    flex: 1, // Small column for sustainability score
    fontSize: 16,
    fontWeight: 'bold',
    color: '#231F20', // White text for contrast
    textAlign: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#231F20', // White text for contrast
  },
});

export default susDashboardStyles;