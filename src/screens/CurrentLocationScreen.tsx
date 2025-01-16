// src/screens/CurrentLocationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { colors } from '../theme/theme';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

interface LocationInfo {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
}

interface LocationState {
  status: 'pending' | 'loading' | 'success' | 'error' | 'denied';
  info: LocationInfo | null;
  error: string | null;
}

const LOCATION_RADIUS = 25; // miles radius to search for events

const CurrentLocationScreen = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    status: 'pending',
    info: null,
    error: null
  });

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      
      return {
        address: data.display_name,
        city: data.address.city || data.address.town || data.address.village,
        state: data.address.state
      };
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  const requestLocationPermission = async () => {
    const permission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    try {
      const result = await check(permission);
      
      if (result === RESULTS.DENIED) {
        const permissionResult = await request(permission);
        return permissionResult === RESULTS.GRANTED;
      }
      
      return result === RESULTS.GRANTED;
    } catch (err) {
      setLocationState(prev => ({
        ...prev,
        status: 'error',
        error: 'Permission check failed'
      }));
      return false;
    }
  };

  const getCurrentLocation = () => {
    setLocationState(prev => ({ ...prev, status: 'loading', error: null }));

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const addressInfo = await fetchAddress(latitude, longitude);
        
        setLocationState({
          status: 'success',
          info: {
            latitude,
            longitude,
            ...addressInfo
          },
          error: null
        });
      },
      (err) => {
        setLocationState({
          status: 'error',
          info: null,
          error: err.message
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    const checkAndGetLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
      } else {
        setLocationState({
          status: 'denied',
          info: null,
          error: 'Location permission denied'
        });
      }
    };

    checkAndGetLocation();
  }, []);

  const renderLocationStatus = () => {
    const { status, info, error } = locationState;

    switch (status) {
      case 'loading':
        return (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.statusText}>Finding your location...</Text>
          </View>
        );

      case 'success':
        return (
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Your Location</Text>
            {info?.city && (
              <Text style={styles.locationText}>
                {info.city}, {info.state}
              </Text>
            )}
            <Text style={styles.locationSubtext}>
              Looking for events within {LOCATION_RADIUS} miles
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={getCurrentLocation}
            >
              <Text style={styles.buttonText}>Refresh Location</Text>
            </TouchableOpacity>
          </View>
        );

      case 'denied':
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Location access is required to find events near you
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={requestLocationPermission}
            >
              <Text style={styles.buttonText}>Enable Location</Text>
            </TouchableOpacity>
          </View>
        );

      case 'error':
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error || 'Unable to get your location'}
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={getCurrentLocation}
            >
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Checking location access...</Text>
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Events Near You</Text>
      <View style={styles.contentContainer}>
        {renderLocationStatus()}
        {locationState.status === 'success' && (
          <View style={styles.eventsContainer}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {/* Event list will be added here */}
            <Text style={styles.placeholderText}>
              Finding events in your area...
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: 'bold',
    padding: 16,
  },
  statusContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.secondary + '20',
    borderRadius: 12,
  },
  locationInfo: {
    padding: 20,
    backgroundColor: colors.secondary + '20',
    borderRadius: 12,
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 8,
  },
  locationSubtext: {
    fontSize: 14,
    color: colors.primary + '80',
    marginBottom: 16,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: colors.primary,
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
  eventsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.primary + '80',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});

export default CurrentLocationScreen;
