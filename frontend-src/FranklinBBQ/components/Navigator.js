import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import InventorySummaryScreen from '../screens/InventorySummaryScreen';
import InventoryManagementScreen from '../screens/InventoryManagementScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';

const colors = {
    primary: '#68C0C0',
    secondary: '#E6740F',
    inactive: '#605f5a',
};

InventorySummaryScreen.navigationOptions = {
    title: 'TODAY',
    tabBarIcon: ({focused, tintColor}) => <FontAwesome5 name={'store'} size={focused ? 18 : 14} color={tintColor} />
};

InventoryManagementScreen.navigationOptions = {
    title: 'INVENTORY',
    tabBarIcon: ({focused, tintColor}) => <FontAwesome5 name={'edit'} size={focused ? 18 : 14} color={tintColor} />
};

OrderManagementScreen.navigationOptions = {
    title: 'ORDERS',
    tabBarIcon: ({focused, tintColor}) => <FontAwesome5 name={'shopping-bag'} size={focused ? 18 : 14} color={tintColor} />
};

const Navigator = createBottomTabNavigator({
    OrderManagement: OrderManagementScreen,
    InventorySummary: InventorySummaryScreen,
    InventoryManagement: InventoryManagementScreen
},{
    initialRouteName: 'InventorySummary',
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