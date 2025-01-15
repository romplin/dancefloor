import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';

const CurrentLocationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events Near You</Text>
      <View style={styles.locationInfo}>
        <Text style={styles.subtitle}>Current Location</Text>
        {/* Location permissions and current location to be implemented */}
      </View>
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
  locationInfo: {
    padding: 16,
    backgroundColor: colors.secondary + '20',
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 8,
  },
});

export default CurrentLocationScreen;
