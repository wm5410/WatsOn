import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getEventById, Event } from '../services/api'; // Make sure Event is imported
import { COLORS } from '../tokens/colors';

export default function EventDetailScreen() {
  const route = useRoute<any>();
  const { eventId } = route.params;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(eventId);
        setEvent(response.data);
      } catch (err) {
        console.error(err);
        // Add a more helpful error message
        setError('Failed to load event details. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  if (error || !event) {
    return (
        <View style={styles.centered}>
            <Text style={styles.errorText}>{error || 'Event not found.'}</Text>
        </View>
    );
  }
  
  // Format the date for a more readable display
  const eventDate = new Date(event.date_time);
  const formattedDateTime = eventDate.toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
  });

  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{event.title}</Text>
                {/* --- THIS IS THE FIX --- */}
                {/* Use the simple 'host' string directly */}
                <Text style={styles.host}>Hosted by {event.host}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>When</Text>
                <Text style={styles.sectionContent}>{formattedDateTime}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Where</Text>
                <Text style={styles.sectionContent}>{event.location_text}</Text>
            </View>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About this Event</Text>
                <Text style={styles.description}>{event.description}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tickets</Text>
                <Text style={styles.sectionContent}>Capacity: {event.ticket_capacity}</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: { flex: 1 },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.text },
  host: { fontSize: 16, color: COLORS.placeholder, marginTop: 8 },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.placeholder,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionContent: { fontSize: 16, color: COLORS.text },
  description: { fontSize: 16, lineHeight: 24, color: COLORS.text },
  errorText: { color: 'red', textAlign: 'center', fontSize: 16 },
});