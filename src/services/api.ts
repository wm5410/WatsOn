import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Make sure this URL is correct and the server is running!
const API_BASE_URL = 'https://45c6a542afbb.ngrok-free.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});


// --- NEW LOGGING ADDED TO INTERCEPTORS ---

// 1. Request Interceptor: Attaches the access token to every outgoing request
api.interceptors.request.use(async (config) => {
  console.log(`[Request] Making a ${config.method?.toUpperCase()} request to ${config.url}`);
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    console.log('[Request] Attaching token to request header...');
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('[Request] No access token found. Sending request without auth.');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. Response Interceptor: Handles expired tokens and retries the request
api.interceptors.response.use(
  (response) => response, // On success, do nothing
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('[Response] Caught 401 Error. Attempting to refresh token...');

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log('[Refresh] No refresh token available. Logging out.');
          await logoutUser();
          return Promise.reject(error);
        }

        console.log('[Refresh] Sending refresh token to server...');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        console.log('[Refresh] Successfully got new access token.');
        await AsyncStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log('[Refresh] Retrying the original request with the new token...');
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('[Refresh] CRITICAL: Token refresh failed!', refreshError);
        await logoutUser();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


// --- YOUR API FUNCTIONS (NO CHANGES NEEDED HERE) ---

export interface Event {
    id: string;
    title: string;
    description: string;
    host: string;
    latitude: number;
    longitude: number;
    location_text: string;
    date_time: string;
    ticket_capacity: number;
}

export const getEvents = () => api.get<Event[]>('/events/');
export const getEventById = (id: string) => api.get<Event>(`/events/${id}/`);
export const createEvent = (eventData: Omit<Event, 'id' | 'host'>) => api.post('/events/', eventData);

export const loginUser = async (credentials: { email: string; password: string; }) => {
    console.log('[Auth] Attempting to log in...');
    const response = await api.post('/auth/login/', credentials);
    if (response.data.access) {
        console.log('[Auth] Login successful. Storing tokens.');
        await AsyncStorage.setItem('accessToken', response.data.access);
        await AsyncStorage.setItem('refreshToken', response.data.refresh);
    }
    return response.data;
};

export const logoutUser = async () => {
    console.log('[Auth] Logging out and clearing tokens.');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
};

export default api;