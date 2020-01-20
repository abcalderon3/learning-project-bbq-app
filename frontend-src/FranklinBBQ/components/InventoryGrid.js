import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { Surface, Text, TouchableRipple } from 'react-native-paper';

import InventoryServiceUtility from '../utils/InventoryServiceUtility';

import { remainingColor } from '../styles/dynamicQuantityColor';

const sampleInventoryItems = [
    {
        item_id: 1,
        item_name: 'Beef Brisket',
        item_quantity: 13.2
    },
    {
        item_id: 2,
        item_name: 'Ribs',
        item_quantity: 9.0
    },
    { item_id: 3 },
    { item_id: 4 },
    { item_id: 5 },
    { item_id: 6 },
    { item_id: 7 },
];

// Displays inventory items based on fetched data
const InventoryGrid = ({ inventoryItems = sampleInventoryItems, inventoryDateString, editMode }) => {
    const InventoryService = new InventoryServiceUtility();

    const handleItemStartQuantityChange = async (itemId, newItemStartQuantity) => {
        let updateSuccessful = await InventoryService.updateItemStartQuantity(inventoryDateString, itemId, newItemStartQuantity);
        if (!updateSuccessful) {
            Alert.alert('Whoops!', 'Failed to update the item.')
        }
    };

    let inventoryItemsToRender;
    if (editMode) {
        inventoryItemsToRender = inventoryItems.map((itemData, index) => (
            <InventoryItemEditable 
                itemName={itemData.display_name} 
                itemQuantity={itemData.start_item_quantity}
                key={itemData.item_id}
                itemId={itemData.item_id}
                handleItemStartQuantityChange={handleItemStartQuantityChange}
                />
        ));
    } else {
        inventoryItemsToRender = inventoryItems.map((itemData, index) => (
            <InventoryItem 
                itemName={itemData.display_name}
                itemQuantity={itemData.current_item_quantity}
                itemPercRemaining={itemData.current_perc_remaining} 
                key={itemData.item_id} />
        ));
    }

    return (
        <KeyboardAvoidingView behavior='padding'>
            <ScrollView contentContainerStyle={styles.inventoryScrollView}>
                <View style={styles.inventoryItemsContainer}>
                    {inventoryItemsToRender}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

class InventoryItem extends React.Component {
    render() {
        let itemCardOpacity = this.props.itemPercRemaining ? 1 : 0.5;

        let dynamicStyles = {
            quantityVisualBack: {
                flex: (1 - this.props.itemPercRemaining),
                backgroundColor: remainingColor(0),
            },
            quantityVisualColor: {
                flex: this.props.itemPercRemaining,
                backgroundColor: remainingColor(this.props.itemPercRemaining),
            },
            inventoryItemCardDynamic: {
                opacity: itemCardOpacity,
            },
        };

        return (
            <View style={styles.inventoryItemCardContainer}>
                <Surface style={[styles.inventoryItemCard, dynamicStyles.inventoryItemCardDynamic]}>
                    <View style={styles.inventoryItemQuantityVisual}>
                        <View style={dynamicStyles.quantityVisualBack}/>
                        <View style={dynamicStyles.quantityVisualColor}/>
                    </View>
                    <View style={styles.inventoryTextBlock}>
                        <Text style={styles.inventoryItemQuantity}>{this.props.itemQuantity}</Text>
                        <Text style={styles.inventoryItemName}>{this.props.itemName}</Text>
                    </View>
                </Surface>
            </View>
        );
        
    }
}

const InventoryItemEditable = ({itemName, itemQuantity, itemId, handleItemStartQuantityChange}) => {
    const [isEditing, setEditing] = useState(false);
    const toggleEditing = () => setEditing(!isEditing);

    const handleQuantityChange = (event) => {
        handleItemStartQuantityChange(itemId, parseFloat(event.nativeEvent.text));
        toggleEditing();
    }

    const editStyles = {
        editItemCard: {
            backgroundColor: '#C8C8C8',
            borderWidth: 1,
            borderColor: '#E6740F',
        },
        editQuantity: {
            color: '#E6740F',
        }
    };

    let inventoryItemQuantityBlock;
    if (isEditing) {
        inventoryItemQuantityBlock = 
            <TextInput 
                onEndEditing={handleQuantityChange} 
                keyboardType='numeric'
                autoFocus={true}
                style={[styles.inventoryItemQuantity, editStyles.editQuantity]}
            />
    } else {
        inventoryItemQuantityBlock = <Text style={[styles.inventoryItemQuantity, editStyles.editQuantity]}>{itemQuantity}</Text>
    }


    return (
        <View style={styles.inventoryItemCardContainer}>
            <TouchableRipple onPress={toggleEditing} style={{borderRadius: 10}}>
                <Surface style={[styles.inventoryItemCard, editStyles.editItemCard]}>
                    <View style={styles.inventoryTextBlock}>
                        {inventoryItemQuantityBlock}
                        <Text style={styles.inventoryItemName}>{itemName}</Text>
                    </View>
                </Surface>
            </TouchableRipple>
        </View>
       
    );
};

InventoryItem.defaultProps = {
    itemName: 'Item Name',
    itemQuantity: '##.#',
    itemPercRemaining: 0,
};

const stylesSettings = {
    inventoryScrollView: {
        flexGrow: 1,
        justifyContent: 'space-evenly',
    },
    inventoryItemsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignContent: 'center',
        flexWrap: 'wrap',
        paddingTop: 50,
        paddingBottom: 50,
    },
    inventoryItemCardContainer: {
        paddingTop: 15
    },
    inventoryItemCard: {
        width: 115,
        height: 130,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        borderRadius: 10,
        overflow: 'hidden',
    },
    inventoryTextBlock: {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: 'center',
    },
    inventoryItemQuantityVisual: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    inventoryItemQuantity: {
        textAlign: 'center',
        fontSize: 48,
        fontFamily: "Open24DisplaySt",
    },
    inventoryItemName: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'AvenirNextCondensed-Medium',
        paddingTop: 5,
    },
};

const styles = StyleSheet.create(stylesSettings);

export default InventoryGrid;