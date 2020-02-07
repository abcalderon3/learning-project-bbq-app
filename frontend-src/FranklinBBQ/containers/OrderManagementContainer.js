import React from 'react';
import { connect } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import OrderManagementScreen from '../screens/OrderManagementScreen';
import { setSelectedDate } from '../redux/actions';

const OrderManagementContainer = ({ selectedDate, orders, orderIds, orderedItems, itemRef, onSelectedDateChange }) => {
    // @todo: we will need to set default values for today's date new Date()

    useFirestoreConnect(['item_ref']);

    useFirestoreConnect(() => [{
      collection: 'orders',
      where: ['date', '==', selectedDate],
    }]);

    // Subcollection Queries, defaults to empty set
    let subCollections = [];
    subCollections = firebaseSubCollectionHelper(orderIds);

    useFirestoreConnect(() => subCollections);

    if (!isLoaded(orderedItems) && !isLoaded(itemRef)) {
      <Text
      >
        Loading...
      </Text>
    } else {
      return (<OrderManagementScreen
        selectedDate={selectedDate}
        onSelectedDateChange={onSelectedDateChange}
        orders={orders}
        orderedItems={orderedItems}
        itemRef={itemRef}
      />);
    }
};

const firebaseSubCollectionHelper = (orderIds) => {
  // Takes in queried order Ids and returns array for firestore

  return orderIds.map((orderId) => {
    return {
      collection: 'orders',
      doc: orderId,
      subcollections: [{ collection: 'items' }],
      storeAs: `order-items-${orderId}`,
    }
  })
};

const mapStateToProps = state => {
    let orderIds = [];
    let orderedItems = {}

    if (state.firestore.data.orders) {
      orderIds = Object.keys(state.firestore.data.orders);

      // Consolidated ordered item list
      orderIds.forEach((orderId) => {
        let subCollectionKey = `order-items-${orderId}`;
        orderedItems[orderId] = state.firestore.data[subCollectionKey];
      });
    }

    return {
        orders: state.firestore.ordered.orders,
        orderIds: orderIds,
        selectedDate: state.selectedDate,
        orderedItems,
        itemRef: state.firestore.data.item_ref,
    };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectedDateChange: (date) => dispatch(setSelectedDate(date)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagementContainer);