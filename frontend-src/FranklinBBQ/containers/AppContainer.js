import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import Navigator from '../components/Navigator';
import { AppStyles } from '../styles/AppStyles';

const AppStack = createStackNavigator({ Navigator: Navigator }, {
    defaultNavigationOptions: {
        headerTitle: <Image source={require('../assets/images/franklin_logo.png')} />,
        headerStyle: AppStyles.headerContainer,
    },
    cardStyle: AppStyles.defaultNavigatorCard,
});

const AppContainer = createAppContainer(
    createSwitchNavigator({
        App: AppStack,
    }, {
        initialRouteName: 'App',
    })
);

export default AppContainer;