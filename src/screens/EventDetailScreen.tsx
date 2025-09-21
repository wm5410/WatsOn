import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getEventById, Event } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

export default function EventDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { eventId } = route.params;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      getEventById(eventId).then(response => {
        setEvent(response.data);
      }).catch(err => console.error(err))
      .finally(() => setLoading(false));
    }
  }, [eventId]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#FFF" /></View>;
  }

  if (!event) {
    return <View style={styles.centered}><Text style={styles.errorText}>Event not found.</Text></View>;
  }
  
  const eventDate = new Date(event.date_time);
  const formattedDateTime = eventDate.toLocaleString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit'
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80' }} 
          style={styles.banner}
        >
          <LinearGradient
            colors={['transparent', 'rgba(30, 30, 30, 0.8)']}
            style={styles.gradient}
          />
          <View style={[styles.header, { paddingTop: insets.top + 50 }]}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.host}>Hosted by {event.host}</Text>
          </View>
        </ImageBackground>
        
        <View style={styles.card}>
          <BlurView style={styles.blurView} blurType="dark" blurAmount={10} />
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={22} color="#FFF" />
            <Text style={styles.detailText}>{formattedDateTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="location-outline" size={22} color="#FFF" />
            <Text style={styles.detailText}>{event.location_text}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="people-outline" size={22} color="#FFF" />
            <Text style={styles.detailText}>{event.ticket_capacity} spots available</Text>
          </View>
        </View>

        <View style={styles.card}>
          <BlurView style={styles.blurView} blurType="dark" blurAmount={10} />
          <Text style={styles.sectionTitle}>About this Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.backButton, { top: insets.top + 15 }]} 
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#242424' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#242424' },
  errorText: { color: 'red', fontSize: 16 },
  banner: { height: 300, justifyContent: 'flex-end' },
  gradient: { ...StyleSheet.absoluteFillObject },
  header: { padding: 20 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  host: { fontSize: 16, color: '#E0E0E0', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
  card: { marginHorizontal: 20, borderRadius: 20, overflow: 'hidden', marginTop: 20, borderColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1 },
  blurView: { ...StyleSheet.absoluteFillObject },
  detailItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  detailText: { color: '#FFFFFF', fontSize: 16, marginLeft: 15, flex: 1 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: '600', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  description: { color: '#B0B0B0', fontSize: 16, lineHeight: 24, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: {
    position: 'absolute',
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});