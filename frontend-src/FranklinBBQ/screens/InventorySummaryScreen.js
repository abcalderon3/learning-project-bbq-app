import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';

import InventoryGrid from '../components/InventoryGrid';

const InventorySummaryScreen = () => {
    const [selectedDate, setSelectedDate] = useState(moment('2017-07-20'));

    const handleDateChange = newDate => setSelectedDate(newDate);

    const selectedDateString = moment(selectedDate).format('YYYY-MM-DD');

    return (
        <View style={styles.screenContainer}>
            <InventoryGrid inventoryDateString={selectedDateString} editMode={false} />
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center'
    }
});

export default InventorySummaryScreen;