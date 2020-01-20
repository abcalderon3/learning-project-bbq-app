import React from 'react';
import { connect } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import OrderManagementScreen from '../screens/OrderManagementScreen';

const OrderManagementContainer = ({orders}) => {
    useFirestoreConnect('orders');
    return (<OrderManagementScreen
      orders={orders}
    />);
};

const mapStateToProps = state => {

    return {
        orders: state.firestore.ordered.orders,
    };
};

export default connect(mapStateToProps)(OrderManagementContainer);