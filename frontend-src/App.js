import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { InventoryView } from './components/InventoryView';

export default function App() {
  return (
    <PaperProvider>
      <View style={{ flex: 1, paddingTop: '10%' }}>
        <InventoryView />
      </View>
    </PaperProvider>
  );
}
