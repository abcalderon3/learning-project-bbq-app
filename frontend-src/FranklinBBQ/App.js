import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { createStore, applyMiddleware } from 'redux';
import { Provider as StoreProvider } from 'react-redux';
import firebase from 'react-native-firebase';
import { ReactReduxFirebaseProvider, ReduxFirestoreProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import thunkMiddleware from 'redux-thunk';
import { createAppContainer } from 'react-navigation';

import rootReducer from './redux/reducers';
import Header from './components/Header';
import Navigator from './components/Navigator';

const AppContainer = createAppContainer(Navigator);

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

firebase.auth().signInAnonymously();
firebase.firestore();
const reduxReactFirebaseConfig = {
  firebase,
  dispatch: store.dispatch,
  createFirestoreInstance,
  config: {
    useFirestoreForProfile: true
  }
};

const App = () => {
  return (
    <StoreProvider store={store}>
      <ReactReduxFirebaseProvider {...reduxReactFirebaseConfig}>
        <ReduxFirestoreProvider {...reduxReactFirebaseConfig}>
          <PaperProvider theme={theme}>
            <View style={styles.safeContainer}>
              <Header />
              <AppContainer />
            </View>
          </PaperProvider>
        </ReduxFirestoreProvider>
      </ReactReduxFirebaseProvider>
    </StoreProvider>
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
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: 'AvenirNextCondensed-Medium'
  }
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1, 
    backgroundColor: theme.colors.background,
  },
});

export default App;
