import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './components/styles/IncidentReporter.styles';

// Mock icons - replace with your actual icons
const ICONS = {
  accident: require('../assets/accident.png'), // replace with your path
  police: require('../assets/police.png'),
  hazard: require('../assets/hazard.png'),
  traffic: require('../assets/traffic.png'),
  construction: require('../assets/construction.png'),
  closure: require('../assets/closure.png'),
};

// Incident types with titles and descriptions
const INCIDENT_TYPES = [
  { id: 'accident', title: 'Accident', description: 'Report a crash' },
  { id: 'police', title: 'Police', description: 'Report police presence' },
  { id: 'hazard', title: 'Hazard', description: 'Report a road hazard' },
  { id: 'traffic', title: 'Traffic', description: 'Report heavy traffic' },
  { id: 'construction', title: 'Construction', description: 'Report works' },
  { id: 'closure', title: 'Closure', description: 'Report road closure' },
];

const { width, height } = Dimensions.get('window');

function IncidentReporter({ onSubmitIncident }) {
  // State management
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [comment, setComment] = useState('');
  const [isCommentView, setIsCommentView] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Open the incident reporter
  const openReporter = () => {
    setIsVisible(true);
    setSelectedIncident(null);
    setComment('');
    setIsCommentView(false);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Close the incident reporter
  const closeReporter = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  // Handle incident selection
  const selectIncident = (incident) => {
    setSelectedIncident(incident);
    setIsCommentView(true);
  };

  // Go back to incident selection
  const backToIncidents = () => {
    setIsCommentView(false);
  };

  // Submit the incident report
  const submitIncident = () => {
    if (selectedIncident) {
      onSubmitIncident({
        type: selectedIncident.id,
        title: selectedIncident.title,
        comment: comment.trim(),
        timestamp: new Date().toISOString(),
        location: {
          // You'd get these from your map/location services
          latitude: 0,
          longitude: 0,
        },
      });

      closeReporter();
    }
  };

  // Prevent rendering if not visible
  if (!isVisible) {
    return (
      <TouchableOpacity
        style={styles.reportButton}
        onPress={openReporter}
        activeOpacity={0.8}
      >
        <Text style={styles.reportButtonText}>Report</Text>
      </TouchableOpacity>
    );
  }

  return (
    <>
      {/* Backdrop/overlay */}
      <TouchableWithoutFeedback onPress={closeReporter}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sliding panel */}
      <Animated.View
        style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={isCommentView ? backToIncidents : closeReporter}
            >
              <Text style={styles.closeButtonText}>
                {isCommentView ? 'Back' : 'Cancel'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {isCommentView ? selectedIncident?.title : 'Report Incident'}
            </Text>

            {isCommentView && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitIncident}
                disabled={!selectedIncident}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          {!isCommentView ? (
            // Incident type selection
            <ScrollView style={styles.incidentList}>
              {INCIDENT_TYPES.map((incident) => (
                <TouchableOpacity
                  key={incident.id}
                  style={styles.incidentItem}
                  onPress={() => selectIncident(incident)}
                >
                  <View style={styles.incidentIconContainer}>
                    <Image
                      source={ICONS[incident.id]}
                      style={styles.incidentIcon}
                    />
                  </View>
                  <View style={styles.incidentTextContainer}>
                    <Text style={styles.incidentTitle}>{incident.title}</Text>
                    <Text style={styles.incidentDescription}>
                      {incident.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            // Comment input view
            <View style={styles.commentContainer}>
              <Text style={styles.commentLabel}>Add details (optional):</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="What happened? Be specific..."
                multiline
                maxLength={200}
                value={comment}
                onChangeText={setComment}
                autoFocus
              />
            </View>
          )}
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

export default IncidentReporter;
