import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1, // Ensure the image stretches to fill the screen
    width: '100%', // Stretch horizontally
    height: '100%', // Stretch vertically
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    opacity: 1,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pendingItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requestButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
    width: 150,
  },
  friendItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  friendRequestName: {
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  rejectButton: {
    backgroundColor: '#E74C3C',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#E74C3C',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
    width: 100,
    alignItems: '',
  },
});

export default styles;
