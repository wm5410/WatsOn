import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createEvent } from '../services/api';
import { COLORS } from '../tokens/colors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function CreateEventScreen() {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [ticketCapacity, setTicketCapacity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Use the correct event type from the library
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false); // Hide the picker immediately
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !locationText || !ticketCapacity || !latitude || !longitude) {
      Alert.alert('Missing Information', 'Please fill out all fields to create the event.');
      return;
    }

    try {
      // This call will now be type-correct because we fixed api.ts
      await createEvent({
        title,
        description,
        location_text: locationText,
        date_time: date.toISOString(),
        ticket_capacity: parseInt(ticketCapacity, 10),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      
      Alert.alert('Success!', 'Your event has been created.');
      navigation.goBack();

    } catch (error) {
      console.error('Event creation failed:', error);
      Alert.alert('Creation Failed', 'Could not create the event. Please ensure you are logged in and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g., Neighborhood Block Party"/>
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.multilineInput]} value={description} onChangeText={setDescription} placeholder="Tell everyone about your event..." multiline/>
          <Text style={styles.label}>Location Address</Text>
          <TextInput style={styles.input} value={locationText} onChangeText={setLocationText} placeholder="e.g., 123 Main St, Phoenix, AZ"/>
          <Text style={styles.label}>Ticket Capacity</Text>
          <TextInput style={styles.input} value={ticketCapacity} onChangeText={setTicketCapacity} placeholder="e.g., 150" keyboardType="number-pad"/>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} placeholder="33.424" keyboardType="numeric"/>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} placeholder="-111.934" keyboardType="numeric"/>
            </View>
          </View>

          <Text style={styles.label}>Event Date & Time</Text>
          <Button onPress={() => setShowDatePicker(true)} title="Select Date and Time" />
          <Text style={styles.dateText}>{date.toLocaleString()}</Text>

          {/* FIXED DateTimePicker */}
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default" // "default", "spinner", "calendar", "clock"
              onChange={onDateChange}
            />
          )}
          
          <View style={styles.buttonSpacer} />
          <Button title="Create Event" onPress={handleSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 8, color: COLORS.text, fontWeight: '500' },
  input: {
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#fff',
    paddingHorizontal: 10, paddingVertical: 12, borderRadius: 8,
    marginBottom: 15, fontSize: 16, color: COLORS.text,
  },
  multilineInput: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1, marginRight: 10 },
  dateText: { textAlign: 'center', color: COLORS.text, marginVertical: 15, fontSize: 16 },
  buttonSpacer: { height: 40 }
});