import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Modal dimensions (partial screen size)
const MODAL_WIDTH = width * 0.7;
const MODAL_HEIGHT = height * 0.6;

const styles = StyleSheet.create({
  reportButton: {
    position: 'absolute',
    left: 20,
    bottom: Platform.OS === 'ios' ? 100 : 80,
    backgroundColor: '#FF4500',
    borderRadius: 30,
    padding: 16, // Slightly increased padding
    paddingHorizontal: 20, // Wider button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4, // Increased shadow opacity
    shadowRadius: 5, // Increased shadow radius
    elevation: 8, // Increased elevation for Android
    zIndex: 10,
  },
  reportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18, // Increased font size
  },
  backdrop: {
    // Changed from absoluteFillObject to only cover part of the screen
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: MODAL_WIDTH + 40, // Just enough to cover the modal with padding
    height: MODAL_HEIGHT + 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // More transparent
    zIndex: 100,
    borderRadius: 20, // Round the corners of the backdrop
  },
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: MODAL_WIDTH,
    height: MODAL_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 20,
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    overflow: 'hidden', // Ensure content doesn't overflow the container
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    minWidth: 60, // Ensure button has enough width
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  submitButton: {
    padding: 8,
    minWidth: 60, // Ensure button has enough width
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  incidentList: {
    flex: 1,
    paddingHorizontal: 8, // Add horizontal padding to prevent items from touching the edges
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12, // Slightly reduced padding to fit better
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width: '100%', // Ensure full width within container
  },
  incidentIconContainer: {
    width: 46, // Slightly reduced to fit better
    height: 46, // Slightly reduced to fit better
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // Reduced margin
    borderRadius: 23,
    backgroundColor: '#F5F5F5',
  },
  incidentIcon: {
    width: 26, // Slightly reduced
    height: 26, // Slightly reduced
  },
  incidentTextContainer: {
    flex: 1,
    paddingRight: 4, // Ensure text doesn't touch the edge
  },
  incidentTitle: {
    fontSize: 15, // Slightly reduced
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2, // Reduced spacing
  },
  incidentDescription: {
    fontSize: 13, // Slightly reduced
    color: '#666',
  },
  commentContainer: {
    flex: 1,
    padding: 16,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#F9F9F9',
  },
});

export default styles;