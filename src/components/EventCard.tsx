import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../tokens/colors';
import { Event } from '../services/api';

interface Props {
  event: Event;
  onPress: () => void;
}

export default function EventCard({ event, onPress }: Props) {
  // --- PARSE AND FORMAT THE DATE ---
  const eventDate = new Date(event.date_time);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{event.title}</Text>
      {/* --- FIX THE HOST DISPLAY --- */}
      <Text style={styles.host}>Hosted by {event.host}</Text>
      {/* --- DISPLAY THE NEW INFO --- */}
      <Text style={styles.details}>{event.location_text}</Text>
      <Text style={styles.details}>{formattedDate} at {formattedTime}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16, // More padding
    marginVertical: 8,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 18, // Bigger title
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  host: {
    fontSize: 14,
    color: COLORS.placeholder,
    marginBottom: 8,
  },
  // Add a new style for details
  details: {
    fontSize: 14,
    color: COLORS.text,
  }
});