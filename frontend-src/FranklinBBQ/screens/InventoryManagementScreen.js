import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import { setSelectedDate } from '../redux/actions';
import InventoryGrid from '../components/InventoryGrid';
import { joinInventoryItemsRef } from '../utils/dataHelpers';

const InventoryManagementScreen = ({ selectedDate, onSelectedDateChange, inventoryItems, theme }) => {
    useFirestoreConnect(['daily_inventories/' + selectedDate + '/items', 'item_ref']);

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

const mapStateToProps = state => {
    let inventoryItems;
    if (state.firestore.data.daily_inventories && state.firestore.data.item_ref) {
        if (state.firestore.data.daily_inventories[state.selectedDate]) {
            inventoryItems = joinInventoryItemsRef(
                state.firestore.data.daily_inventories[state.selectedDate].items,
                state.firestore.data.item_ref
            );
        }
    }

    return {
        selectedDate: state.selectedDate,
        inventoryItems,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSelectedDateChange: (date) => dispatch(setSelectedDate(date))
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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(InventoryManagementScreen));