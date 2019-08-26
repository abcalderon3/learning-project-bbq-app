import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import InventoryGrid from '../components/InventoryGrid';

const InventorySummaryScreen = () => {
    const [selectedDate, setSelectedDate] = useState(moment('2017-07-20'));

    const handleDateChange = newDate => setSelectedDate(newDate);

    const selectedDateString = moment(selectedDate).format('YYYY-MM-DD');

    return (
        <View style={styles.screenContainer}>
            <DateButton date={selectedDate} dateChange={handleDateChange} />
            <InventoryGrid inventoryDateString={selectedDateString} editMode={true} />
        </View>
    );
};

const DateButton = ({date, dateChange}) => {
    return (
        <DatePicker
            style={styles.datePicker}
            date={date}
            mode="date"
            placeholder="Select Date..."
            format="YYYY-MM-DD"
            confirmBtnText="Done"
            cancelBtnText="Cancel"
            onDateChange={dateChange}
        />
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center'
    },
    datePicker: {
        width: 150,
        paddingTop: 30
    }
});

export default InventorySummaryScreen;