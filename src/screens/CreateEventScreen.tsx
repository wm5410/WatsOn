import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createEvent } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import HapticFeedback from 'react-native-haptic-feedback';
import { BlurView } from '@react-native-community/blur';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [ticketCapacity, setTicketCapacity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    HapticFeedback.trigger('impactMedium', hapticOptions);
    if (!title || !description || !locationText || !ticketCapacity || !latitude || !longitude) {
      Alert.alert('Hold Up', 'Please fill out all the fields to create your event.');
      return;
    }

    try {
      await createEvent({
        title,
        description,
        location_text: locationText,
        date_time: date.toISOString(),
        ticket_capacity: parseInt(ticketCapacity, 10),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      
      Alert.alert('Success!', 'Your event is live!');
      navigation.goBack();

    } catch (error) {
      console.error('Event creation failed:', error);
      Alert.alert('Uh Oh...', 'We couldn\'t create the event. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: insets.top + 20,      // safe area top padding
          paddingBottom: insets.bottom + 20
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerTitle}>Create an Event</Text>
        <Text style={styles.headerSubtitle}>Fill in the details to get the party started.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g., Sunset Bonfire" placeholderTextColor="#555" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.multilineInput]} value={description} onChangeText={setDescription} placeholder="Tell everyone about the vibe..." placeholderTextColor="#555" multiline />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location Address</Text>
          <TextInput style={styles.input} value={locationText} onChangeText={setLocationText} placeholder="e.g., 123 Beach Blvd, Malibu, CA" placeholderTextColor="#555" />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} placeholder="34.0259" placeholderTextColor="#555" keyboardType="numeric" />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} placeholder="-118.7798" placeholderTextColor="#555" keyboardType="numeric" />
          </View>
        </View>
        
        <View style={styles.formGroup}>
            <Text style={styles.label}>Capacity</Text>
            <TextInput style={styles.input} value={ticketCapacity} onChangeText={setTicketCapacity} placeholder="e.g., 150" placeholderTextColor="#555" keyboardType="number-pad" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date & Time</Text>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar-outline" size={20} color="#B0B0B0" />
            <Text style={styles.datePickerButtonText}>{date.toLocaleString()}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker value={date} mode="datetime" display="spinner" onChange={onDateChange} themeVariant="dark" />
        )}
      </ScrollView>

      {/* footer: frosted rounded bar matching map */}
      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 10 }}>
  <View style={styles.bottomBarLike}>
    <BlurView style={styles.blurFill} blurType="dark" blurAmount={10} />
    <TouchableOpacity
      style={styles.submitButton}
      onPress={handleSubmit}
      activeOpacity={0.85}
    >
      <Text style={styles.submitButtonText}>Create Event</Text>
    </TouchableOpacity>
  </View>
</View>

      {/* Back / Close button (matches Login/Event style) */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 15 }]}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Close"
      >
        <Icon name="close" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#242424' },

  // keep scrollView style (used on ScrollView)
  scrollView: {
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 30,
  },

  // form groups and labels (used repeatedly)
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // inputs
  input: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },

  // row for lat/lon fields
  row: {
    flexDirection: 'row',
  },

  // date picker button styles referenced in JSX
  datePickerButton: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 10,
  },

  // bottom bar / blur wrapper
  bottomBarLike: {
    height: 70,
    borderRadius: 30,
    overflow: 'hidden',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurFill: { ...StyleSheet.absoluteFillObject },

  // submit button visuals inside the frosted bar (keeps original behavior)
  submitButton: {
    flex: 1,                 // fill the parent's height (bottomBarLike has fixed height)
    width: '100%',           // ensure full width inside the rounded bar
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // keep the frosted look (blur behind)
    paddingHorizontal: 16,   // comfortable inner spacing for the label
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // back button
  backButton: {
    position: 'absolute',
    right: 15,
  },

  // small helpers (if you reference elsewhere)
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12.5 }, { translateY: -12.5 }],
  },
});
