// components/EventMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';
import { Event } from '../services/api';

interface Props {
  event: Event;
  onPress: () => void;
}

export default function EventMarker({ event, onPress }: Props) {
  const eventDate = new Date(event.date_time);
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Marker coordinate={{ latitude: event.latitude, longitude: event.longitude }}>
      <View style={styles.markerContainer}>
        <Icon name="sparkles" size={16} color="#FFF" style={styles.icon} />
      </View>
      
      <Callout tooltip onPress={onPress}>
        {/* Outer wrapper clips the BlurView to the rounded corners */}
        <View style={styles.calloutOuter}>
          {/* Blur background (covers whole container) */}
          <BlurView style={styles.blurFill} blurType="dark" blurAmount={12} />

          {/* Foreground content */}
          <View style={styles.calloutContent}>
            <Text style={styles.calloutTitle} numberOfLines={2} ellipsizeMode="tail">
              {event.title}
            </Text>
            <Text style={styles.calloutTime}>{formattedTime}</Text>

            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>Free</Text>
            </View>
          </View>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: 'rgba(90, 34, 194, 0.9)',
    padding: 8,
    borderRadius: 20,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    alignSelf: 'center',
  },

  /* Outer wrapper: clips blur and defines size/radius */
  calloutOuter: {
    borderRadius: 12,
    overflow: 'hidden',               // IMPORTANT: clip blur to rounded corners
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    width: 220,                       // keep width to avoid weird wrapping
    elevation: 6,
  },

  /* Blur fills the outer wrapper */
  blurFill: {
    ...StyleSheet.absoluteFillObject,
  },

  /* content sits above the blur */
  calloutContent: {
    padding: 12,
    backgroundColor: 'transparent',   // transparent so blur is visible behind content
  },

  calloutTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    flexShrink: 1,
  },
  calloutTime: {
    color: '#E0E0E0',
    fontSize: 14,
    marginBottom: 8,
  },
  priceContainer: {
    backgroundColor: 'rgba(56, 161, 105, 0.12)',
    borderRadius: 8,
    borderColor: 'rgba(56, 161, 105, 1)',
    borderWidth: 1,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  priceText: {
    color: '#38A169',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
