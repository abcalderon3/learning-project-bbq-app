import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { Surface, Text, TouchableRipple } from 'react-native-paper';

import FirestoreDataUtility from '../utils/FirestoreDataUtility';
import InventoryServiceUtility from '../utils/InventoryServiceUtility';

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
const InventoryGrid = ({ inventoryDateString, editMode }) => {
    const [inventoryItems, setInventoryItems] = useState(sampleInventoryItems);
    const [isLoading, setLoading] = useState(false);

    const InventoryService = new InventoryServiceUtility();
    const FirestoreData = new FirestoreDataUtility();

    useEffect(() => {
        const fetchInventoryData = async () => {
            setLoading(true);

            // Request for backend to create or provide the selected day's inventory day document path
            let inventoryDayDocPath = await InventoryService.getInventoryDay(inventoryDateString);

            // Get Inventory Day document data from Firestore
            let inventoryItems = await FirestoreData.getInventoryItems(inventoryDayDocPath);

            setInventoryItems(inventoryItems);
            setLoading(false);
        };
        fetchInventoryData();
    }, [inventoryDateString]);

    const handleItemStartQuantityChange = async (itemId, newItemStartQuantity) => {
        let updateSuccessful = await InventoryService.updateItemStartQuantity(inventoryDateString, itemId, newItemStartQuantity);
        if (updateSuccessful) {
            let newInventoryItems = inventoryItems.map(item => item.item_id === itemId ? { ...item, start_item_quantity: newItemStartQuantity } : item);

            setInventoryItems(newInventoryItems);
        } else {
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
        let remainingColor = '#C8C8C8';
        let itemCardOpacity = 1;
        if(this.props.itemPercRemaining >= 0.75) {
            remainingColor = '#8CE53D'; // Green
        } else if (this.props.itemPercRemaining >= 0.25) {
            remainingColor = '#F2D557'; // Yellow
        } else if (this.props.itemPercRemaining > 0) {
            remainingColor = '#F27C57'; // Red
        } else {
            itemCardOpacity = 0.5;
        }

        let dynamicStyles = {
            quantityVisualBack: {
                flex: (1 - this.props.itemPercRemaining),
                backgroundColor: '#C8C8C8',
            },
            quantityVisualColor: {
                flex: this.props.itemPercRemaining,
                backgroundColor: remainingColor,
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

    let inventoryItemQuantityBlock;
    if (isEditing) {
        inventoryItemQuantityBlock = 
            <TextInput 
                onEndEditing={handleQuantityChange} 
                keyboardType='numeric'
                autoFocus={true}
                style={styles.inventoryItemQuantity}
            />
    } else {
        inventoryItemQuantityBlock = <Text style={styles.inventoryItemQuantity}>{itemQuantity}</Text>
    }

    return (
        <View style={styles.inventoryItemCardContainer}>
            <TouchableRipple onPress={toggleEditing} style={{borderRadius: 10}}>
                <Surface style={styles.inventoryItemCard}>
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
}

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
    },
};

const styles = StyleSheet.create(stylesSettings);

export default InventoryGrid;