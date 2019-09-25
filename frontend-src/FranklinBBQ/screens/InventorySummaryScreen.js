import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { FAB, withTheme } from 'react-native-paper';

import { getInventoryItems } from '../redux/actions';
import InventoryGrid from '../components/InventoryGrid';
import { joinInventoryItemsRef } from '../utils/dataHelpers';

const InventorySummaryScreen = ({ todayDate, inventoryItems, navigation, theme }) => {
    useFirestoreConnect(['daily_inventories/' + todayDate + '/items', 'item_ref']);

    return (
        <View style={styles.screenContainer}>
            <FAB 
                label='New Order' 
                icon='add' 
                onPress={() => navigation.navigate('TakeOrder')}
                color={theme.colors.background}
                style={[styles.fab, {backgroundColor: theme.colors.secondary}]}
            />
            <InventoryGrid inventoryItems={inventoryItems} inventoryDateString={todayDate} editMode={false} />
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



const mapStateToProps = (state) => {
    let inventoryItems;
    if (state.firestore.data.daily_inventories && state.firestore.data.item_ref) {
        if (state.firestore.data.daily_inventories[state.todayDate]) {
            inventoryItems = joinInventoryItemsRef(
                state.firestore.data.daily_inventories[state.todayDate].items,
                state.firestore.data.item_ref
            );
        }
    }

    return {
        todayDate: state.todayDate,
        inventoryItems,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getInventoryItems: (inventoryDayDocPath) => dispatch(getInventoryItems(inventoryDayDocPath))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(InventorySummaryScreen));