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
import { composeWithDevTools } from 'redux-devtools-extension';
import { createAppContainer } from 'react-navigation';

import rootReducer from './redux/reducers';
import Header from './components/Header';
import Navigator from './components/Navigator';
import { colors } from './styles/colors';
import { fonts } from './styles/fonts';

const AppContainer = createAppContainer(Navigator);

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

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
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: fonts.regular,
  }
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1, 
    backgroundColor: theme.colors.background,
  },
});

export default App;
