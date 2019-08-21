import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import Header from './components/Header';
import InventorySummaryScreen from './screens/InventorySummaryScreen';

const App = () => {
  return (
    <PaperProvider theme={theme}>
        <SafeAreaView style={styles.safeContainer}>
          <Header />
          <InventorySummaryScreen />
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
