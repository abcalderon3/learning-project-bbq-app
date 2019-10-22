import React, { useState, useEffect } from 'react';
import { View, Keyboard, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Text, TextInput, withTheme, List, Button } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import DismissableKeyboard from '../components/DismissableKeyboard';

const OrderScreen = ({ 
    inventoryItems, 
    newOrder = {items: []}, 
    theme, 
    editPartySize,
    addItemToOrder,
    editItemOrdered,
    submitNewOrder,
}) => {
    // Calculate which items are available vs. in the order and provide all display data
    const [availableItems, setAvailableItems] = useState([]);
    const [newOrderItems, setNewOrderItems] = useState([]);

    useEffect(() => {
        let newOrderItemList = [];
        let availableItemList = [];
        inventoryItems.forEach(item => {
            const foundNewOrderItem = newOrder.items.find((newOrderItem) => newOrderItem.item_id === item.item_id );
            if (foundNewOrderItem) {
                newOrderItemList.push({...item, ...foundNewOrderItem});
            } else {
                availableItemList.push(item);
            }
        });
        setAvailableItems(availableItemList);
        setNewOrderItems(newOrderItemList);
    }, [inventoryItems, newOrder.items]);

    const [selectedItems, setSelectedItems] = useState([]);

    const onSelectItem = (selectedItemId) => {        
        // Pull the selectedItem out of availableItems (with only one pass of the array)
        const [selectedItem, availableItemsSansSelected] = 
            availableItems.reduce((result, element) => {
                result[element.item_id === selectedItemId ? 0 : 1].push(element);
                return result;
            }, [[],[]]);
        setSelectedItems(selectedItems.concat(selectedItem));
        setAvailableItems(availableItemsSansSelected);
    };

    const onUnselectItem = (selectedItemId) => {
        setSelectedItems(selectedItems.filter(item => item.item_id != selectedItemId));
    };

    return (
        <DismissableKeyboard>
            <View style={{flex: 1}}>
                <PartySizeInput partySize={newOrder.party_size} handlePartySizeChange={editPartySize} theme={theme} />
                <OrderDrawer newOrderItems={newOrderItems} />
                <SelectedDrawer selectedItems={selectedItems} onSelectionCompletion={addItemToOrder} onUnselectItem={onUnselectItem} />
                <AvailableDrawer availableItems={availableItems} onSelectItem={onSelectItem} />
                <Button mode='contained' onPress={() => submitNewOrder()}><Text>Save</Text></Button>
            </View>
        </DismissableKeyboard>
    );
};

const PartySizeInput = ({ handlePartySizeChange, theme }) => {
    const handlePartySizeInput = (event) => {
        handlePartySizeChange(parseInt(event.nativeEvent.text));
    };

    return (
        <View style={partySizeInputStyles.container}>
            <Text style={partySizeInputStyles.label}>Party Size</Text>
            <TextInput
                onEndEditing={handlePartySizeInput}
                onBlur={() => Keyboard.dismiss()}
                mode='outlined'
                keyboardType='numeric'
                clearTextOnFocus={true}
                autoFocus={true}
                style={partySizeInputStyles.textInput}
                selectionColor={theme.colors.secondary}
                theme={{ colors: { primary: theme.colors.secondary, placeholder: theme.colors.primary } }}
            />
        </View>
    );
};

const itemListMapping = ({itemList, status, displayQuantityKey, onSelectItem, onSelectionCompletion, onUnselectItem }) => {
    return itemList.map(item => (
        <ListItem 
            status={status}
            key={item.item_id}
            itemId={item.item_id}
            itemDisplayName={item.display_name}
            displayQuantity={item[displayQuantityKey]}
            selectItem={onSelectItem ? onSelectItem : undefined}
            addItemToOrder={onSelectionCompletion}
            unselectItem={onUnselectItem}
        />
    ));
};

const OrderDrawer = ({ newOrderItems }) => {
    const args = {
        itemList: newOrderItems,
        status: 'in_order',
        displayQuantityKey: 'item_quantity_ordered'
    };

    return (
        <View>{itemListMapping(args)}</View>
    );
};

const SelectedDrawer = ({ selectedItems, onSelectionCompletion, onUnselectItem }) => {
    const args = {
        itemList: selectedItems,
        status: 'selected',
        onSelectionCompletion,
        onUnselectItem,
    };

    return (
        <KeyboardAvoidingView>{itemListMapping(args)}</KeyboardAvoidingView>
    );
};

const AvailableDrawer = ({ availableItems, onSelectItem }) => {
    const args = {
        itemList: availableItems,
        status: 'available',
        displayQuantityKey: 'current_item_quantity',
        onSelectItem
    };

    return (
        <View>{itemListMapping(args)}</View>
    );
};

const ListItem = withTheme(({ 
    status, 
    itemId, 
    itemDisplayName, 
    displayQuantity, 
    selectItem, 
    addItemToOrder, 
    unselectItem,
    theme 
}) => {
    const completeItemSelection = (event) => {
        // TODO: Add validation against quantity available here
        addItemToOrder(itemId, parseFloat(event.nativeEvent.text));
        unselectItem(itemId);
    };

    let listItemPropValues = {
        rightNode: <Text>{displayQuantity}</Text>,
    };
    switch (status) {
        case 'available':
            listItemPropValues.leftIcon = 'plus-circle';
            listItemPropValues.onPress = () => selectItem(itemId);
            break;
        case 'selected':
            listItemPropValues.leftIcon = 'arrow-alt-circle-up';
            listItemPropValues.rightNode = 
                <TextInput
                    onEndEditing={completeItemSelection}
                    onBlur={() => Keyboard.dismiss()}
                    keyboardType='numeric'
                    autoFocus={true}
                    selectionColor={theme.colors.secondary}
                    theme={{ colors: { primary: theme.colors.secondary, placeholder: theme.colors.primary } }}
                />;
            break;
        case 'in_order':
            listItemPropValues.leftIcon = 'check-circle';
            break;
    }

    return (
        <List.Item 
            title={itemDisplayName}
            left={props => <List.Icon {...props} icon={props => <FontAwesome5 name={listItemPropValues.leftIcon} {...props} />} />}
            right={props => listItemPropValues.rightNode}
            onPress={listItemPropValues.onPress}
        />
    );
});

const partySizeInputStyles = StyleSheet.create({
    container: {
        flexDirection:'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    label: {
        flex: 3,
        fontSize: 20, 
        textAlign: 'center',
    },
    textInput: {
        flex: 1,
    },
});

export default withTheme(OrderScreen);