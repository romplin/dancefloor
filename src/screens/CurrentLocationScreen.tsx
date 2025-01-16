import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../theme/theme';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const CurrentLocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('pending');
  const [error, setError] = useState(null);

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
      setError('Permission check failed');
      return false;
    }
  };

  const getCurrentLocation = () => {
    setLocationStatus('loading');
    setError(null);

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setLocationStatus('success');
      },
      (err) => {
        setError(err.message);
        setLocationStatus('error');
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
        setLocationStatus('denied');
      }
    };

    checkAndGetLocation();
  }, []);

  const renderLocationInfo = () => {
    switch (locationStatus) {
      case 'loading':
        return <Text style={styles.statusText}>Finding your location...</Text>;
      
      case 'success':
        return (
          <View>
            <Text style={styles.locationText}>
              Latitude: {location.latitude.toFixed(4)}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {location.longitude.toFixed(4)}
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={getCurrentLocation}
            >
              <Text style={styles.refreshButtonText}>Refresh Location</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'denied':
        return (
          <View>
            <Text style={styles.errorText}>
              Location permission was denied. Please enable location services to find events near you.
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={requestLocationPermission}
            >
              <Text style={styles.refreshButtonText}>Enable Location</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'error':
        return (
          <View>
            <Text style={styles.errorText}>
              Error getting location: {error}
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={getCurrentLocation}
            >
              <Text style={styles.refreshButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        return <Text style={styles.statusText}>Checking location permissions...</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events Near You</Text>
      <View style={styles.locationContainer}>
        {renderLocationInfo()}
      </View>
      {locationStatus === 'success' && (
        <View style={styles.eventsContainer}>
          <Text style={styles.subtitle}>Nearby Events</Text>
          {/* Events list will go here */}
          <Text style={styles.placeholderText}>Finding events in your area...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  locationContainer: {
    padding: 16,
    backgroundColor: colors.secondary + '20',
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    color: colors.primary,
  },
  locationText: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
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
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
  eventsContainer: {
    flex: 1,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.primary + '80',
    fontStyle: 'italic',
  },
});

export default CurrentLocationScreen;
