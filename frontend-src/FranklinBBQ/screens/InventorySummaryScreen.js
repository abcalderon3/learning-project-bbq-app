import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { FAB, withTheme, Text } from 'react-native-paper';

import { getInventoryItems } from '../redux/actions';
import InventoryGrid from '../components/InventoryGrid';

const InventorySummaryScreen = ({ todayDate, inventoryItems, getInventoryItems, navigation, theme }) => {
    useEffect(() => {
        getInventoryItems('daily_inventories/' + todayDate);
    });

    return (
        <View style={styles.screenContainer}>
            <FAB 
                label='New Order' 
                icon='add' 
                onPress={() => navigation.navigate('TakeOrder')}
                color={theme.colors.background}
                style={[styles.fab, {backgroundColor: theme.colors.secondary}]}
            />
            <Text>{JSON.stringify(inventoryItems)}</Text>
            <InventoryGrid inventoryDateString={todayDate} editMode={false} />
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

const mapStateToProps = state => {
    return {
        todayDate: state.todayDate,
        inventoryItems: state.inventory.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getInventoryItems: (inventoryDayDocPath) => dispatch(getInventoryItems(inventoryDayDocPath))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(InventorySummaryScreen));