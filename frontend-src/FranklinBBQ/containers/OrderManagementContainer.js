import React from 'react';
import { connect } from 'react-redux';

import OrderManagementScreen from '../screens/OrderManagementScreen';

const mapStateToProps = state => {
    return {
        orders: state.firestore.orders,
    };
};

const OrderManagementContainer = connect(mapStateToProps)(OrderManagementScreen);

export default OrderManagementContainer;