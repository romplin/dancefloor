import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { colors } from './src/theme/theme';
import Navigation from './src/navigation/Navigation';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
      />
      <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
