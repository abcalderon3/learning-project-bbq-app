import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import { InventoryGrid } from './components/InventoryGrid';
import { Header } from './components/Header';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Header pageTitle="Current Inventory" />
      <View style={{ flex: 1, paddingTop: '10%' }}>
        <InventoryGrid />
      </View>
    </PaperProvider>
  );
}

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