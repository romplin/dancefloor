import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from './src/theme/theme';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Dancefloor</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    color: colors.textLight,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
