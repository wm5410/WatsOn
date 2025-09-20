// src/screens/MapScreen.tsx

import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { SAMPLE_EVENTS } from '../services/mockData';
import EventCard from '../components/EventCard';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../tokens/colors';

export default function MapScreen() {
  const navigation = useNavigation<any>();
 
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text>Map Placeholder</Text>
      </View>
      <Button title="+ Create Event" onPress={() => navigation.navigate('Create')} />
      <FlatList
        data={SAMPLE_EVENTS}
        keyExtractor={e => e.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate('Event', { eventId: item.id })}
          />
        )}
      />
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
});
