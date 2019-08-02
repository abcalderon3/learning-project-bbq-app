import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { FirestoreDataUtility } from '../utils/FirestoreDataUtility';

// TODO: BBQ-25 Replace this stub with real data
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


export class InventoryGrid extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            inventoryItems: sampleInventoryItems
        }
    }

    async componentDidMount() {
        const FirestoreData = new FirestoreDataUtility();
        let inventoryItems = await FirestoreData.getInventoryItems('daily_inventories/2017-07-20');

        this.setState({ inventoryItems: inventoryItems });
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.inventoryScrollView}>
                <View style={styles.inventoryItemsContainer}>
                    {this.state.inventoryItems.map((itemData, index) => (
                        <InventoryItem 
                            key={itemData.item_id}
                            itemName={itemData.display_name}
                            itemQuantity={itemData.current_item_quantity}
                            itemPercRemaining={itemData.current_perc_remaining} />
                    ))}
                </View>
            </ScrollView>
        );
    }
}

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
        opacity: 0.5,
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
    },
    inventoryItemName: {
        textAlign: 'center',
        fontSize: 20,
    },
};

const styles = StyleSheet.create(stylesSettings);