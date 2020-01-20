import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import {  } from 'react-redux-firebase';

import InventoryGrid from '../components/InventoryGrid';
import { joinInventoryItemsRef } from '../utils/dataHelpers';

const InventoryManagementScreen = ({ selectedDate, onSelectedDateChange, inventoryDayPath, inventoryItems, theme }) => {
    (inventoryDayPath ? [inventoryDayPath + '/items', 'item_ref'] : 'item_ref');

    return (
        <View style={styles.screenContainer}>
            <DateButton date={selectedDate} dateChange={onSelectedDateChange} theme={theme} />
            <InventoryGrid inventoryDateString={selectedDate} inventoryItems={inventoryItems} editMode={true} />
        </View>
    );
};

const DateButton = ({date, dateChange, theme}) => {
    const displayFormat = 'MMM. D, YYYY';
    const dataFormat = 'YYYY-MM-DD';
    return (
        <DatePicker
            style={styles.datePicker}
            date={moment(date).format(displayFormat)}
            mode="date"
            placeholder="Select Date..."
            format={displayFormat}
            confirmBtnText="Done"
            cancelBtnText="Cancel"
            onDateChange={formattedDateString => dateChange(moment(formattedDateString, displayFormat).format(dataFormat))}
            iconComponent={
                <FontAwesome5
                    name='calendar-alt'
                    size={20}
                    color={theme.colors.secondary}
                    style={{ paddingLeft: 10 }}
                />
            }
            customStyles={{
                dateInput: {
                    borderColor: theme.colors.secondary,
                    borderRadius: 5
                }
            }}
        />
    );
};

const mapStateToProps = (state, { selectedDate }) => {
    let inventoryItems;
    if (state.firestore.data.daily_inventories && state.firestore.data.item_ref) {
        if (state.firestore.data.daily_inventories[selectedDate]) {
            inventoryItems = joinInventoryItemsRef(
                state.firestore.data.daily_inventories[selectedDate].items,
                state.firestore.data.item_ref
            );
        }
    }

    return {
        inventoryItems,
    };
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center'
    },
    datePicker: {
        width: 150,
        paddingTop: 30,
    }
});

export default connect(mapStateToProps)(withTheme(InventoryManagementScreen));