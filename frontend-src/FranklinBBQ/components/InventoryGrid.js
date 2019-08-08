import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { FirestoreDataUtility } from '../utils/FirestoreDataUtility';
import { InventoryServiceUtility } from '../utils/InventoryServiceUtility';

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
const InventoryGrid = ({ inventoryDateString }) => {
    const [inventoryItems, setInventoryItems] = useState(sampleInventoryItems);
    const [isLoading, toggleLoading] = useState(false);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                toggleLoading(true);
                const InventoryService = new InventoryServiceUtility();
                // Request for backend to create or provide the selected day's inventory day document path
                let inventoryDayDocPath = InventoryService.config.enabled ? await InventoryService.getInventoryDay(inventoryDateString) : 'daily_inventories/' + inventoryDateString;

                const FirestoreData = new FirestoreDataUtility();
                // Get Inventory Day document data from Firestore
                let inventoryItems = await FirestoreData.getInventoryItems(inventoryDayDocPath);

                setInventoryItems(inventoryItems);
                toggleLoading(false);
            } catch (error) {
                console.log(error);
                toggleLoading(false);
            }
        };
        fetchInventoryData();
    })

    return (
        <ScrollView contentContainerStyle={styles.inventoryScrollView}>
            <View style={styles.inventoryItemsContainer}>
                {inventoryItems.map((itemData, index) => (
                    <InventoryItem 
                        key={itemData.item_id}
                        itemName={itemData.display_name}
                        itemQuantity={itemData.current_item_quantity}
                        itemPercRemaining={itemData.current_perc_remaining} />
                ))}
            </View>
        </ScrollView>
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
        );
        
    }
}

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
    inventoryItemCard: {
        width: 115,
        height: 130,
        marginTop: 15,
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