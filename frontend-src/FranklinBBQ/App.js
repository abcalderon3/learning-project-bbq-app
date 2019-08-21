import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { createAppContainer } from 'react-navigation';

import Header from './components/Header';
import Navigator from './components/Navigator';

const AppContainer = createAppContainer(Navigator);

const App = () => {
  return (
    <PaperProvider theme={theme}>
        <SafeAreaView style={styles.safeContainer}>
          <Header />
          <AppContainer />
        </SafeAreaView>
    </PaperProvider>
  );
};

const theme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: '#68C0C0',
    secondary: '#E6740F',
    background: '#F1F0E1',
  }
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1, 
    backgroundColor: theme.colors.background,
  },
});

export default App;
