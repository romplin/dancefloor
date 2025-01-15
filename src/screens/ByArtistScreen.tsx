import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { colors } from '../theme/theme';

const ByArtistScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search By Artist</Text>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Enter artist name"
          placeholderTextColor={colors.primary + '80'}
        />
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
  searchContainer: {
    marginTop: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.primary,
  },
});

export default ByArtistScreen;
