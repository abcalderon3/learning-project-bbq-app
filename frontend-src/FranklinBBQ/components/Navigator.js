import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import InventorySummaryScreen from '../screens/InventorySummaryScreen';
import InventoryManagementContainer from '../containers/InventoryManagementContainer';
import OrderManagementContainer from '../containers/OrderManagementContainer';
import OrderContainer from '../containers/OrderContainer';

import { colors } from '../styles/colors';
import { fonts } from '../styles/fonts';

InventoryManagementContainer.navigationOptions = {
    title: 'INVENTORY',
    tabBarIcon: ({focused, tintColor}) => <FontAwesome5 name={'edit'} size={focused ? 18 : 14} color={tintColor} />
};

const TodayNavigator = createStackNavigator({
    InventorySummary: InventorySummaryScreen,
    TakeOrder: OrderContainer
},{
    initialRouteName: 'InventorySummary',
    navigationOptions: {
        title: 'TODAY',
        tabBarIcon: ({focused, tintColor}) => <FontAwesome5 name={'store'} size={focused ? 18 : 14} color={tintColor} />,
    },
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
        backgroundColor: colors.background
    }
});

const OrderManagementNavigator = createStackNavigator({
  OrderManagement: OrderManagementContainer,
  ViewOrder: OrderContainer
},{
  initialRouteName: 'OrderManagement',
  navigationOptions: {
      title: 'ORDERS',
      tabBarIcon: ({focused, tintColor}) => <FontAwesome5 name={'store'} size={focused ? 18 : 14} color={tintColor} />,
  },
  mode: 'modal',
  headerMode: 'float',
  cardStyle: {
      backgroundColor: colors.background
  }
});

const Navigator = createBottomTabNavigator({
    OrderManagement: OrderManagementNavigator,
    Today: TodayNavigator,
    InventoryManagement: InventoryManagementContainer
},{
    initialRouteName: 'Today',
    tabBarOptions: {
        activeTintColor: colors.secondary,
        inactiveTintColor: colors.inactive,
        style: {
            backgroundColor: colors.primary,
        },
        labelStyle: {
            fontFamily: fonts.buttons,
            fontSize: 16
        },
    }

});

export default Navigator;