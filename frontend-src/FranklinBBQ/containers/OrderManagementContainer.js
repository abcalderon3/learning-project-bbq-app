import React from 'react';
import { connect } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import OrderManagementScreen from '../screens/OrderManagementScreen';
import { setSelectedDate } from '../redux/actions';

const OrderManagementContainer = ({ selectedDate, orders, onSelectedDateChange }) => {
    // @todo: we will need to set default values for today's date new Date()

    useFirestoreConnect(() => [{
      collection: 'orders',
      where: ['date', '==', selectedDate],
      // subcollections: [{ collection: 'items' }],
      // storeAs: 'order-items'
    }]);
    // useFirestoreConnect({
    //   collection: 'orders',
    //   doc: orders ? [Object.keys(orders)] : null,
    //   subcollections: [{
    //     collection: 'items'
    //   }],
    // });

    return (<OrderManagementScreen
      selectedDate={selectedDate}
      onSelectedDateChange={onSelectedDateChange}
      orders={orders}
    />);
};

const mapStateToProps = state => {
    return {
        orders: state.firestore.ordered.orders,
        selectedDate: state.selectedDate,
    };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectedDateChange: (date) => dispatch(setSelectedDate(date)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagementContainer);