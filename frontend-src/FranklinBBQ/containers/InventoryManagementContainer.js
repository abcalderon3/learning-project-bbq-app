import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { setSelectedDate, getInventoryDay } from '../redux/actions';
import InventoryManagementScreen from '../screens/InventoryManagementScreen';

const InventoryManagementContainer = ({ selectedDate, onSelectedDateChange, inventoryDayPath, getInventoryDay }) => {
    useEffect(() => {
        getInventoryDay(selectedDate);
    }, [selectedDate]);

    return (
        <InventoryManagementScreen 
            selectedDate={selectedDate}
            onSelectedDateChange={onSelectedDateChange}
            inventoryDayPath={inventoryDayPath}
        />
    );
};

const mapStateToProps = state => {
    return {
        selectedDate: state.selectedDate,
        inventoryDayPath: state.inventoryDayPaths[state.selectedDate],
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSelectedDateChange: (date) => dispatch(setSelectedDate(date)),
        getInventoryDay: inventoryDate => dispatch(getInventoryDay(inventoryDate)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InventoryManagementContainer);