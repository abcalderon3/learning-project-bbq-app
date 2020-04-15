import React, { useState, useEffect } from 'react';
import { View, Keyboard, StyleSheet, KeyboardAvoidingView, TextInput } from 'react-native';
import { Text, withTheme, List, Button, TextInput as TextInputPaper, IconButton } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import DismissableKeyboard from '../components/DismissableKeyboard';
import * as OrderStyles from '../styles/OrderStyles';
import { dynamicQtyBackgroundColor } from '../styles/dynamicQuantityColor';
import { colors } from '../styles/colors';

const OrderScreen = ({
    inventoryItems,
    newOrder = {items: []},
    theme,
    editPartySize,
    cudItemInOrder,
    submitNewOrder,
    navigation,
    existingOrderId = false,
}) => {
    const [itemsOrderStatus, setItemsOrderStatus] = useState([]);
    const editMode = existingOrderId ? false : true;

    useEffect(() => {
        setItemsOrderStatus(inventoryItems.map((item) => {
            const foundNewOrderItem = newOrder.items.find((newOrderItem) => newOrderItem.item_id === item.item_id );
            if (foundNewOrderItem) {
                return {
                    ...item,
                    ...foundNewOrderItem,
                    status: 'in_order'
                };
            } else {
                return {
                    ...item,
                    status: 'available'
                };
            }
        }));
    }, [inventoryItems, newOrder.items]);

    const onChangeOrderItemStatus = (itemId, newStatus) => {
        setItemsOrderStatus(itemsOrderStatus.map((item) => {
            if (item.item_id === itemId) {
                return {
                    ...item,
                    status: newStatus,
                };
            } else {
                return item;
            }
        }));
    };

    return (
        <DismissableKeyboard>
            <View style={{flex: 1}}>
                <PartySizeInput partySize={newOrder.party_size} handlePartySizeChange={editPartySize} theme={theme} editMode={editMode} />
                <OrderDrawer newOrderItems={itemsOrderStatus.filter(item => item.status === 'in_order')} changeOrderItemStatus={onChangeOrderItemStatus} cudItemInOrder={cudItemInOrder} editMode={editMode}/>
                <View>
                  {editMode ?
                    <View>
                      <SelectedDrawer selectedItems={itemsOrderStatus.filter(item => item.status === 'selected')} changeOrderItemStatus={onChangeOrderItemStatus} cudItemInOrder={cudItemInOrder} />
                      <AvailableDrawer availableItems={itemsOrderStatus.filter(item => item.status === 'available')} changeOrderItemStatus={onChangeOrderItemStatus} />
                      <Button
                          mode='contained'
                          onPress={() => {
                              submitNewOrder();
                              navigation.navigate('InventorySummary');
                          }}
                          style={OrderStyles.button.container}
                      >
                          <Text style={OrderStyles.button.label}>SAVE</Text>
                      </Button>
                    </View>
                    : null
                  }
                  {editMode ? null:
                  <Button
                    mode='contained'
                    onPress={() => {
                        navigation.navigate('OrderManagement');
                    }}
                    style={OrderStyles.button.container}
                >
                    <Text style={OrderStyles.button.label}>BACK</Text>
                  </Button>
                  }
                </View>
            </View>
        </DismissableKeyboard>
    );
};

const PartySizeInput = ({ partySize = 0, handlePartySizeChange, theme, editMode }) => {
    const handlePartySizeInput = (text) => {
        handlePartySizeChange(parseInt(text));
    };

    return (
        <View style={OrderStyles.partySizeInputStyles.container}>
            <Text style={OrderStyles.partySizeInputStyles.label}>Party Size</Text>
            <TextInputPaper
                value={partySize.toString()}
                onChangeText={handlePartySizeInput}
                onBlur={() => Keyboard.dismiss()}
                mode='outlined'
                keyboardType='numeric'
                clearTextOnFocus={true}
                autoFocus={editMode}
                disabled={!editMode}
                style={OrderStyles.partySizeInputStyles.textInput}
                selectionColor={theme.colors.secondary}
                theme={{ colors: { primary: theme.colors.secondary, placeholder: theme.colors.primary } }}
            />
        </View>
    );
};

const itemListMapping = ({itemList, status, displayQuantityKey, changeOrderItemStatus, cudItemInOrder, editMode = true }) => {
    return itemList.map(item => (
        <ListItem
            status={status}
            key={item.item_id}
            itemId={item.item_id}
            itemDisplayName={item.display_name}
            displayQuantity={item[displayQuantityKey]}
            currentPercRemaining={item.current_perc_remaining}
            changeOrderItemStatus={changeOrderItemStatus}
            cudItemInOrder={cudItemInOrder}
            editMode={editMode}
        />
    ));
};

const OrderDrawer = ({ newOrderItems, changeOrderItemStatus, cudItemInOrder, editMode }) => {
    const args = {
        itemList: newOrderItems,
        status: 'in_order',
        displayQuantityKey: 'item_quantity_ordered',
        changeOrderItemStatus,
        cudItemInOrder,
        editMode,
    };

    return (
        <View style={newOrderItems.length > 0 ? OrderStyles.OrderDrawer.view : undefined}>{itemListMapping(args)}</View>
    );
};

const SelectedDrawer = ({ selectedItems, changeOrderItemStatus, cudItemInOrder, }) => {
    const args = {
        itemList: selectedItems,
        status: 'selected',
        changeOrderItemStatus,
        cudItemInOrder,
    };

    return (
        <KeyboardAvoidingView>{itemListMapping(args)}</KeyboardAvoidingView>
    );
};

const AvailableDrawer = ({ availableItems, changeOrderItemStatus, }) => {
    const args = {
        itemList: availableItems,
        status: 'available',
        displayQuantityKey: 'current_item_quantity',
        changeOrderItemStatus,
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
    currentPercRemaining,
    changeOrderItemStatus,
    cudItemInOrder,
    editMode,
    theme,
}) => {
    const completeItemSelection = (event) => {
        // TODO: Add validation against quantity available here
        cudItemInOrder(itemId, parseFloat(event.nativeEvent.text));
        changeOrderItemStatus(itemId, 'in_order');
    };

    let listItemPropValues = {
        rightNode: <Text style={OrderStyles.listItemStyles.displayQuantity}>{displayQuantity}</Text>,
        style: [OrderStyles.listItemStyles.listItem],
        leftIconColor: colors.inactive,
    };

    let deleteButton;
    const deleteItem = () => {
        cudItemInOrder(itemId, 0);
        changeOrderItemStatus(itemId, 'available');
    };

    switch (status) {
        case 'available':
            listItemPropValues.leftIcon = 'plus-circle';
            listItemPropValues.onPress = () => changeOrderItemStatus(itemId, 'selected');
            listItemPropValues.rightNode =
                <View style={[OrderStyles.listItemStyles.displayQuantityContainer, dynamicQtyBackgroundColor(currentPercRemaining)]}>
                    {listItemPropValues.rightNode}
                </View>;
            break;
        case 'selected':
            listItemPropValues.style.push(OrderStyles.listItemStyles.listItemSelected);
            listItemPropValues.leftIcon = 'arrow-alt-circle-up';
            listItemPropValues.leftIconColor = colors.secondary;
            listItemPropValues.rightNode =
                <TextInput
                    onEndEditing={completeItemSelection}
                    onBlur={() => Keyboard.dismiss()}
                    keyboardType='numeric'
                    autoFocus={true}
                    selectionColor={theme.colors.secondary}
                    style={OrderStyles.listItemStyles.quantityInput}
                />;
            break;
        case 'in_order':
            listItemPropValues.style.push(OrderStyles.listItemStyles.listItemOrdered);
            listItemPropValues.leftIcon = 'check-circle';
            listItemPropValues.leftIconColor = colors.primary;
            listItemPropValues.rightNode =
                <View style={OrderStyles.listItemStyles.orderedQuantityContainer}>
                    <View style={[OrderStyles.listItemStyles.displayQuantityContainer]}>
                        {listItemPropValues.rightNode}
                    </View>
                    <View>
                      {
                        editMode ?
                        <IconButton
                        icon={props => <FontAwesome5 name='minus-circle' {...props} />}
                        color={colors.destructiveAction}
                        onPress={() => deleteItem()}
                        />
                        : null
                      }
                    </View>
                </View>;
            listItemPropValues.onPress = () => editMode ? changeOrderItemStatus(itemId, 'selected') : null;
            deleteButton =
                <IconButton
                    icon={props => <FontAwesome5 name='minus-circle' {...props} />}
                    color={colors.destructiveAction}
                    onPress={() => deleteItem()}
                />;
            break;
    }

    return (
        <List.Item
            title={itemDisplayName}
            left={props => <List.Icon {...props} color={listItemPropValues.leftIconColor} icon={props => <FontAwesome5 name={listItemPropValues.leftIcon} {...props} />} />}
            right={props => listItemPropValues.rightNode}
            onPress={listItemPropValues.onPress}
            style={listItemPropValues.style}
        />
    );
});

export default withTheme(OrderScreen);