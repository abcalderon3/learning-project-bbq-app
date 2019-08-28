import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';
import { FAB, withTheme } from 'react-native-paper';

import InventoryGrid from '../components/InventoryGrid';

const InventorySummaryScreen = ({ navigation, theme }) => {
    const [selectedDate, setSelectedDate] = useState(moment('2017-07-20'));

    const handleDateChange = newDate => setSelectedDate(newDate);

    const selectedDateString = moment(selectedDate).format('YYYY-MM-DD');

    return (
        <View style={styles.screenContainer}>
            <FAB 
                label='New Order' 
                icon='add' 
                onPress={() => navigation.navigate('TakeOrder')}
                color={theme.colors.background}
                style={[styles.fab, {backgroundColor: theme.colors.secondary}]}
            />
            <InventoryGrid inventoryDateString={selectedDateString} editMode={false} />
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center'
    },
    fab: {
        marginTop: 30,
        fontFamily: 'AvenirNextCondensed-Bold'
    }
});

export default withTheme(InventorySummaryScreen);