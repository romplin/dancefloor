import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CurrentLocationScreen from '../screens/CurrentLocationScreen';
import ByCityScreen from '../screens/ByCityScreen';
import ByArtistScreen from '../screens/ByArtistScreen';
import { colors } from '../theme/theme';

const Navigation = () => {
  const [currentScreen, setCurrentScreen] = React.useState('Current Location');

  const screens = {
    'Current Location': CurrentLocationScreen,
    'By City': ByCityScreen,
    'By Artist': ByArtistScreen,
  };

  const CurrentScreenComponent = screens[currentScreen];

  return (
    <View style={styles.container}>
      <CurrentScreenComponent />
      <View style={styles.tabBar}>
        {Object.keys(screens).map((screenName) => (
          <TouchableOpacity
            key={screenName}
            style={[
              styles.tab,
              currentScreen === screenName && styles.activeTab,
            ]}
            onPress={() => setCurrentScreen(screenName)}
          >
            <Text
              style={[
                styles.tabText,
                currentScreen === screenName && styles.activeTabText,
              ]}
            >
              {screenName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primary + '20',
  },
  tabText: {
    color: colors.primary,
    fontSize: 12,
    textAlign: 'center',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
});

export default Navigation;
