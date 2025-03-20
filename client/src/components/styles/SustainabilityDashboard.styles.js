import { StyleSheet } from 'react-native';

const susDashboardStyles = StyleSheet.create({
  lineChart: {
    position: 'absolute',
    bottom: 40,
    right: '0%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
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
});

export default susDashboardStyles;
