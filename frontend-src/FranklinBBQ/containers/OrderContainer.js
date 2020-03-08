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
  navigation,
  existingOrderId
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
      existingOrderId={existingOrderId}
    />
  )
}

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

const OrderContainer = connect(mapStateToProps, orderActions)(IntermediateOrderScreen);

export default OrderContainer;