import React from 'react';
import { connect } from 'react-redux';

import OrderScreen from '../screens/OrderScreen';
import { joinInventoryItemsRef } from '../utils/dataHelpers';
import { orderActions } from '../redux/actions';

const mapStateToProps = (state, { navigation }) => {
    let inventoryItems;
    if (state.firestore.data.daily_inventories && state.firestore.data.item_ref) {
        if (state.firestore.data.daily_inventories[state.todayDate]) {
            inventoryItems = joinInventoryItemsRef(
                state.firestore.data.daily_inventories[state.todayDate].items,
                state.firestore.data.item_ref
            );
        }
    }

    const existingOrderId = navigation.getParam('existingOrderId', false);

    let newOrder;
    if (existingOrderId) {
      newOrder = state.firestore.data.orders[existingOrderId];
      const orderItemsKey = 'order-items-' + existingOrderId;
      newOrder.items = Object.entries(state.firestore.data[orderItemsKey]).map(([orderItemId, orderItemObj]) => {
        return {
          item_id: orderItemId,
          item_quantity_ordered: orderItemObj.item_quantity_order,
        };
      });
    } else {
      newOrder = state.newOrder;
    }

    return {
        inventoryItems,
        newOrder,
        existingOrderId,
    };
};

const OrderContainer = connect(mapStateToProps, orderActions)(OrderScreen);

export default OrderContainer;