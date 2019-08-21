import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import InventorySummaryScreen from '../screens/InventorySummaryScreen';
import InventoryManagementScreen from '../screens/InventoryManagementScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';

InventorySummaryScreen.navigationOptions = {
    title: 'Today',
    tabBarIcon: <FontAwesome5 name={'store'} size={18} />
};

InventoryManagementScreen.navigationOptions = {
    title: 'Inventory',
    tabBarIcon: <FontAwesome5 name={'edit'} size={18} />
};

OrderManagementScreen.navigationOptions = {
    title: 'Orders',
    tabBarIcon: <FontAwesome5 name={'shopping-bag'} size={18} />
};

const Navigator = createMaterialBottomTabNavigator({
    OrderManagement: OrderManagementScreen,
    InventorySummary: InventorySummaryScreen,
    InventoryManagement: InventoryManagementScreen
},{
    initialRouteName: 'InventorySummary',
});

export default Navigator;