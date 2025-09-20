// src/components/EventCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../tokens/colors';

interface Props {
  event: { id: string; title: string; host: string };
  onPress: () => void;
}

export default function EventCard({ event, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.host}>Hosted by {event.host}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  host: {
    fontSize: 14,
    color: COLORS.placeholder,
  },
});
