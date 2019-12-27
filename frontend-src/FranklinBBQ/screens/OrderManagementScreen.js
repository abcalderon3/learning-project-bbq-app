import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { List } from 'react-native-paper';
import { tsPropertySignature } from '@babel/types';

import { OrderMgmtListItemStyles, listItemStyles } from '../styles/OrderStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ListItems = ({list}) => {
  // Right node of ListItems
  const RightNode = ({orderNumber, orderSummary, ...props}) => {
    return (
      <View
        style={OrderMgmtListItemStyles.rightNodeContainer}
      >
        <Text
          style={OrderMgmtListItemStyles.rightText}
        >
          {orderNumber}
        </Text>
        <Text
          numberOfLines={1}
          style={OrderMgmtListItemStyles.rightText}
        >
          {orderSummary}
        </Text>
      </View>
    )
  };

  // Left node of ListItems. Includes icon and party size
  const LeftNode = ({partySize, ...props}) => {
    const partyIcon = ({props}) => {
      return (
        <FontAwesome5 name='users' {...props} />
      )
    };

    return (
      <View
        style={OrderMgmtListItemStyles.leftNodeContainer}
      >
        <Text>
          {partySize}
        </Text>
        <List.Icon {...props} icon={partyIcon} />
      </View>
    )
  }

  const outputList = list.map((item) => {
    return(
      <List.Item
        right={props => <RightNode {...props}
            orderSummary={item.orderSummary}
            orderNumber={item.orderNumber}
        />}
        left={props => <LeftNode {...props} partySize={item.partySize} />}
        style={OrderMgmtListItemStyles.listItem}
      />
    )
  });

  return outputList;
};

const OrderManagementScreen = () => {
    let testData = [
      {orderNumber: 'uuid-234', partySize: 2, orderSummary: 'Beef Brisket - 1lb, Pulled Pork - 2lb'},
      {orderNumber: 'uuid-235', partySize: 1, orderSummary: 'Sausages - 5 links, Beef Ribs - 4lbs, Suckling Pig - 1lb'},
      {orderNumber: 'uuid-332', partySize: 16, orderSummary: 'Steak - 3 links, Rabbit - 4lbs, Pikachu - 20lbs'},
    ];

    // WARNING: testData must be changed to a real value
    return (
        <View style={styles.screenContainer}>
          <View
            style={OrderMgmtListItemStyles.listContainer}
          >
            <ListItems
              list={testData}
            />
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    }
});

export default OrderManagementScreen;