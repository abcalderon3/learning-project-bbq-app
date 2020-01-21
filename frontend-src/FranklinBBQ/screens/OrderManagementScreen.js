import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { List, withTheme } from 'react-native-paper';
import moment from 'moment';
import { tsPropertySignature } from '@babel/types';

import { OrderMgmtListItemStyles } from '../styles/OrderStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

let testData = [
  {orderNumber: 'uuid-234', partySize: 2, orderSummary: 'Beef Brisket - 1lb, Pulled Pork - 2lb'},
  {orderNumber: 'uuid-235', partySize: 1, orderSummary: 'Sausages - 5 links, Beef Ribs - 4lbs, Suckling Pig - 1lb'},
  {orderNumber: 'uuid-332', partySize: 16, orderSummary: 'Steak - 3 links, Rabbit - 4lbs, Pikachu - 20lbs'},
];

// Main View for Order Summary by day
const OrderManagementScreen = ({
  orders = testData,
  selectedDate,
  onSelectedDateChange,
  theme,
  navigation,
}) => {
  console.log('order screen: ', orders);
  return (
      <View style={styles.screenContainer}>
        <DateButton
          selectedDate={selectedDate}
          dateChange={onSelectedDateChange}
          theme={theme}
        />
        <View
          style={OrderMgmtListItemStyles.listContainer}
        >
          <ListItems
            list={orders}
          />
        </View>
      </View>
  );
};

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
          Order #: {orderNumber}
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
            orderNumber={item.order_number}
        />}
        left={props => <LeftNode {...props} partySize={item.party_size} />}
        style={OrderMgmtListItemStyles.listItem}
        key={item.id}
        onPress={() => {
          console.log('pressed');
        }}
      />
    )
  });

  return outputList;
};

const DateButton = ({ selectedDate, dateChange, theme}) => {
  const displayFormat = 'MMM. D, YYYY';
  const dataFormat = 'YYYY-MM-DD';
  let currentDate = new Date();
  return (
      <DatePicker
          style={styles.datePicker}
          date={moment(selectedDate).format(displayFormat)}
          mode="date"
          placeholder="Select Date..."
          format={displayFormat}
          confirmBtnText="Done"
          cancelBtnText="Cancel"
          onDateChange={formattedDateString => dateChange(moment(formattedDateString, displayFormat).format(dataFormat))}
          iconComponent={
              <FontAwesome5
                  name='calendar-alt'
                  size={20}
                  color={theme.colors.secondary}
                  style={{ paddingLeft: 10 }}
              />
          }
          customStyles={{
              dateInput: {
                  borderColor: theme.colors.secondary,
                  borderRadius: 5
              }
          }}
      />
  );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    datePicker: {
      width: 150,
      paddingTop: 30,
      marginBottom: 40,
    }
});

export default withTheme(OrderManagementScreen);