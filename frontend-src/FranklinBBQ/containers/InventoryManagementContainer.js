import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { setSelectedDate, getInventoryDay, updateInventoryItemStartQty } from '../redux/actions';
import InventoryManagementScreen from '../screens/InventoryManagementScreen';

const InventoryManagementContainer = ({ selectedDate, onSelectedDateChange, inventoryDayPath, getInventoryDay, updateInventoryItemStartQty }) => {
    useEffect(() => {
        getInventoryDay(selectedDate);
    }, [selectedDate]);

    return (
        <InventoryManagementScreen
            selectedDate={selectedDate}
            Change={Change}
            inventoryDayPath={inventoryDayPath}
            updateInventoryItemStartQty={updateInventoryItemStartQty}
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
        Change: (date) => dispatch(setSelectedDate(date)),
        getInventoryDay: inventoryDate => dispatch(getInventoryDay(inventoryDate)),
        updateInventoryItemStartQty: (inventoryDateString, itemId, newItemStartQuantity) => dispatch(updateInventoryItemStartQty(inventoryDateString, itemId, newItemStartQuantity)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InventoryManagementContainer);