import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';

// TODO: BBQ-25 Replace this stub with real data
const inventoryDayItems = [
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
            inventoryDayItems
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.inventoryScrollView}>
                <View style={styles.inventoryItemsContainer}>
                    {this.state.inventoryDayItems.map((itemData, index) => (
                        <InventoryItem 
                            key={itemData.item_id}
                            initialItemName={itemData.item_name}
                            initialItemQuantity={itemData.item_quantity} />
                    ))}
                </View>
            </ScrollView>
        );
    }
}

class InventoryItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            itemName: this.props.initialItemName,
            itemQuantity: this.props.initialItemQuantity
        }

    }

    updateItemName(newItemName) {
        this.setState({
            itemName: newItemName
        });
    }

    updateItemQuantity(newItemQuantity) {
        this.setState({
            itemQuantity: newItemQuantity
        });
    }

    render() {
        return (
            <Card style={styles.inventoryItemCard}>
                <View style={styles.inventoryTextBlock}>
                    <Text style={styles.inventoryItemQuantity}>{this.state.itemQuantity}</Text>
                    <Text style={styles.inventoryItemName}>{this.state.itemName}</Text>
                </View>        
            </Card>
        );
        
    }
}

InventoryItem.defaultProps = {
    initialItemName: 'Item Name',
    initialItemQuantity: '##.#'
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
    },
    inventoryTextBlock: {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: 'center',
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