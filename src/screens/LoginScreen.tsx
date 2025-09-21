import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

export default function LoginScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await loginUser({ email, password });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Login Failed', 'The email or password you entered is incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#444444', '#242424']}
        style={styles.gradient}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kav}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue.</Text>

          <View style={styles.card}>
            <BlurView style={styles.blurView} blurType="dark" blurAmount={10} />
            <View style={styles.inputGroup}>
              <Icon name="mail-outline" size={22} color="#B0B0B0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#B0B0B0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Icon name="lock-closed-outline" size={22} color="#B0B0B0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#B0B0B0"
                secureTextEntry
              />
            </View>
          </View>
        </ScrollView>
        <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginButtonText}>Login</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <TouchableOpacity style={[styles.backButton, { top: insets.top + 15 }]} onPress={() => navigation.goBack()}>
        <Icon name="close" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
  gradient: { ...StyleSheet.absoluteFillObject },
  kav: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#B0B0B0', textAlign: 'center', marginTop: 8, marginBottom: 40 },
  card: {
    borderRadius: 30,               // larger radius like map bottom bar
    overflow: 'hidden',             // clip BlurView to rounded corners
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
  },  blurView: { ...StyleSheet.absoluteFillObject },
  inputGroup: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.06)' },
  inputIcon: { paddingLeft: 20 },
  input: { flex: 1, color: '#FFF', fontSize: 16, paddingVertical: 18, paddingHorizontal: 12 },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  bottomBarLike: {
    height: 70,
    borderRadius: 30,
    overflow: 'hidden',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: { backgroundColor: '#FFF', padding: 18, borderRadius: 18, alignItems: 'center' },
  loginButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  backButton: { position: 'absolute', right: 15 },
});