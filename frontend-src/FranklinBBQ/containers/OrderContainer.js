import React from 'react';
import { connect } from 'react-redux';

import OrderScreen from '../screens/OrderScreen';
import { joinInventoryItemsRef } from '../utils/dataHelpers';
import { orderActions } from '../redux/actions';

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

const OrderContainer = connect(mapStateToProps, orderActions)(OrderScreen);

export default OrderContainer;