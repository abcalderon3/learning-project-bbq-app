import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import InventorySummaryScreen from '../screens/InventorySummaryScreen';
import InventoryManagementScreen from '../screens/InventoryManagementScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';
import OrderScreen from '../screens/OrderScreen';

const colors = {
    primary: '#68C0C0',
    secondary: '#E6740F',
    inactive: '#605f5a',
};

InventoryManagementScreen.navigationOptions = {
    title: 'INVENTORY',
    tabBarIcon: ({focused, tintColor}) => <FontAwesome5 name={'edit'} size={focused ? 18 : 14} color={tintColor} />
};

OrderManagementScreen.navigationOptions = {
    title: 'ORDERS',
    tabBarIcon: ({focused, tintColor}) => <FontAwesome5 name={'shopping-bag'} size={focused ? 18 : 14} color={tintColor} />
};

const TodayNavigator = createStackNavigator({
    InventorySummary: InventorySummaryScreen,
    TakeOrder: OrderScreen
},{
    initialRouteName: 'InventorySummary',
    navigationOptions: {
        title: 'TODAY',
        tabBarIcon: ({focused, tintColor}) => <FontAwesome5 name={'store'} size={focused ? 18 : 14} color={tintColor} />    
    },
    mode: 'modal',
    headerMode: 'none',
});

const Navigator = createBottomTabNavigator({
    OrderManagement: OrderManagementScreen,
    Today: TodayNavigator,
    InventoryManagement: InventoryManagementScreen
},{
    initialRouteName: 'Today',
    tabBarOptions: {
        activeTintColor: colors.secondary,
        inactiveTintColor: colors.inactive,
        style: {
            backgroundColor: colors.primary,
        },
        labelStyle: {
            fontFamily: 'AvenirNextCondensed-Bold',
            fontSize: 16
        },
    }
    
});

export default Navigator;