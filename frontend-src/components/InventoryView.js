import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';

// TODO: BBQ-25 Replace this stub with real data
const inventoryDayItems = [
    {
        item_name: 'Beef Brisket',
        item_quantity: 13.2
    },
    {
        item_name: 'Ribs',
        item_quantity: 9.0
    }
];

export class InventoryView extends React.Component {
    render() {
        return (
            <ScrollView contentContainerStyle={styles.inventoryView}>
                <View style={styles.inventoryRow}>
                    <InventoryItem initialItemName={inventoryDayItems[0].item_name} initialItemQuantity={inventoryDayItems[0].item_quantity} />
                    <InventoryItem />
                    <InventoryItem />
                </View>
                <View style={styles.inventoryRow}>
                    <InventoryItem />
                    <InventoryItem />
                    <InventoryItem />
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
    inventoryView: {
        flexGrow: 1,
        justifyContent: 'space-evenly',
    },
    inventoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    inventoryItemCard: {
        width: 115,
        height: 130,
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