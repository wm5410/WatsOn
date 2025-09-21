import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, PermissionsAndroid, Platform, Alert, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getEvents, Event } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';
import HapticFeedback from 'react-native-haptic-feedback';
import EventMarker from '../components/EventMarker';
import { mapStyle } from '../tokens/mapStyle';
import { BlurView } from '@react-native-community/blur';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number; longitude: number} | null>(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      setIsAuthenticated(!!token);

      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const userLocation = { latitude, longitude };
            setCurrentLocation(userLocation);
            
            setTimeout(() => {
              if (mapRef.current) {
                mapRef.current.animateToRegion({
                  ...userLocation,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }, 1500);
              }
            }, 100);
            
            const response = await getEvents(latitude, longitude);
            setEvents(response.data);
          },
          (error) => {
            console.log(error);
            Alert.alert("Location Error", "Could not get current location.");
            getEvents(36.1699, -115.1398).then(res => setEvents(res.data));
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      } else {
        const response = await getEvents(36.1699, -115.1398);
        setEvents(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const centerMapOnUser = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  };
  
  const onButtonPress = (action: () => void) => {
    HapticFeedback.trigger('impactLight', hapticOptions);
    action();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 36.1699,
          longitude: -115.1398,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={mapStyle} 
      >
        {events.map(event => (
          <EventMarker
            key={event.id}
            event={event}
            onPress={() => navigation.navigate('Event', { eventId: event.id })}
          />
        ))}
      </MapView>
      
      {loading && <ActivityIndicator size="large" color="#FFF" style={styles.loadingIndicator} />}

      <TouchableOpacity 
        style={[styles.locationButton, { bottom: insets.bottom + 90 }]} 
        onPress={() => onButtonPress(centerMapOnUser)}
      >
        <BlurView style={styles.blurView} blurType="dark" blurAmount={10} />
        <Icon name="navigate-outline" size={24} color="#FFF" />
      </TouchableOpacity>

      <View style={[styles.bottomBar, { bottom: insets.bottom + 15 }]}>
        <BlurView style={styles.blurView} blurType="dark" blurAmount={10} />
        <TouchableOpacity style={styles.barButton} onPress={() => onButtonPress(() => Alert.alert("Filter", "Filter options coming soon!"))}>
          <Icon name="options-outline" size={26} color="#FFF" />
        </TouchableOpacity>
        
        {isAuthenticated ? (
          <TouchableOpacity style={styles.barButton} onPress={() => onButtonPress(() => navigation.navigate('Create'))}>
            <Icon name="add-circle-outline" size={32} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.barButton} onPress={() => onButtonPress(() => navigation.navigate('Login'))}>
            <Icon name="log-in-outline" size={28} color="#FFF" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.barButton} onPress={() => onButtonPress(() => Alert.alert("Profile", "Profile screen coming soon!"))}>
          <Icon name="person-outline" size={26} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  map: { ...StyleSheet.absoluteFillObject },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12.5 }, { translateY: -12.5 }],
  },
  locationButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  bottomBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 65,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  barButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});