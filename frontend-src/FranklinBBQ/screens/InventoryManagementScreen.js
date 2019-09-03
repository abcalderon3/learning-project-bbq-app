import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import InventoryGrid from '../components/InventoryGrid';

const InventoryManagementScreen = ({ theme }) => {
    const [selectedDate, setSelectedDate] = useState(moment('2017-07-20'));

    const handleDateChange = newDate => setSelectedDate(newDate);

    const selectedDateString = moment(selectedDate).format('YYYY-MM-DD');

    return (
        <View style={styles.screenContainer}>
            <DateButton date={selectedDate} dateChange={handleDateChange} theme={theme} />
            <InventoryGrid inventoryDateString={selectedDateString} editMode={true} />
        </View>
    );
};

const DateButton = ({date, dateChange, theme}) => {
    return (
        <DatePicker
            style={styles.datePicker}
            date={date}
            mode="date"
            placeholder="Select Date..."
            format="MMM. D, YYYY"
            confirmBtnText="Done"
            cancelBtnText="Cancel"
            onDateChange={dateChange}
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

export default withTheme(InventoryManagementScreen);