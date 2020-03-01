import React from 'react';
import { connect } from 'react-redux';

import OrderScreen from '../screens/OrderScreen';
import { joinInventoryItemsRef } from '../utils/dataHelpers';
import { orderActions } from '../redux/actions';

const IntermediateOrderScreen = ({
  inventoryItems,
  newOrder,
  editPartySize,
  cudItemInOrder,
  submitNewOrder,
  navigation
  }) => {
  const navRoute = 'InventorySummary';

  return (
    <OrderScreen
      inventoryItems={inventoryItems}
      newOrder={newOrder}
      editPartySize={editPartySize}
      cudItemInOrder={cudItemInOrder}
      submitNewOrder={submitNewOrder}
      navigation={navigation}
      navRoute={navRoute}
    />
  )
}

const mapStateToProps = state => {
    let inventoryItems;
    if (state.firestore.data.daily_inventories && state.firestore.data.item_ref) {
        if (state.firestore.data.daily_inventories[state.todayDate]) {
            inventoryItems = joinInventoryItemsRef(
                state.firestore.data.daily_inventories[state.todayDate].items,
                state.firestore.data.item_ref
            );
        }
    }

    return {
        inventoryItems,
        newOrder: state.newOrder,
    };
};

// orderActions is a mapDispatchToProps as an object and can be used directly with connect HOC
// Utilizing mapDispatchToProps in order to switch out submitNewOrder
const mapDispatchToProps = dispatch => {
  const { editPartySize, cudItemInOrder, submitNewOrder } = orderActions;
  return {
    editPartySize: () => dispatch(editPartySize()),
    cudItemInOrder: () => dispatch(cudItemInOrder()),
    submitNewOrder: () => dispatch(submitNewOrder()),
  }
}

const OrderContainer = connect(mapStateToProps, mapDispatchToProps)(IntermediateOrderScreen);

export default OrderContainer;