import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
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
  friendItem: {
    backgroundColor: '#d1f0d1',
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
  },
  removeButton: {
    backgroundColor: '#E74C3C',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
});

export default styles;
