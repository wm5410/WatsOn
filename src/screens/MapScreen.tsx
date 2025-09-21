import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getEvents, Event } from '../services/api'; // Import API functions
import EventCard from '../components/EventCard';
import { COLORS } from '../tokens/colors';

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused(); // Hook to refetch data when screen is focused

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEvents();
      setEvents(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch events. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch events when the screen is focused (e.g., after creating a new event)
    if (isFocused) {
      fetchEvents();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text>Map Placeholder</Text>
      </View>
      <Button title="+ Create Event" onPress={() => navigation.navigate('Create')} />

      {loading && <ActivityIndicator size="large" color={COLORS.text} />}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={events}
          keyExtractor={(e) => e.id.toString()}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate('Event', { eventId: item.id })}
            />
          )}
          refreshing={loading}
          onRefresh={fetchEvents} // Add pull-to-refresh functionality
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapPlaceholder: {
    height: 250,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
});