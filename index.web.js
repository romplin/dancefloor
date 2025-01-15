import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('dancefloor', () => App);

// Register the app for web
if (module.hot) {
  module.hot.accept();
}

AppRegistry.runApplication('dancefloor', {
  rootTag: document.getElementById('root')
});
