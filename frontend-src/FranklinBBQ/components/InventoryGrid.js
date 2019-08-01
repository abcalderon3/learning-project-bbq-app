import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { Card, Title, Text, Divider } from 'react-native-paper';

import { FirestoreDataUtility } from '../utils/FirestoreDataUtility';

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
            inventoryDayItems,
            newInventoryDoc: 'Nothing happened at all'
        }
    }

    componentDidMount() {
        const FirestoreData = new FirestoreDataUtility();
        let inventoryDayDocument = FirestoreData.getInventoryDayDocument('2017-07-20');

        this.setState({ newInventoryDoc: inventoryDayDocument });
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.inventoryScrollView}>
                <View style={styles.inventoryItemsContainer}>
                    {this.state.inventoryDayItems.map((itemData, index) => (
                        <InventoryItem 
                            key={itemData.item_id}
                            itemName={itemData.item_name}
                            itemQuantity={itemData.item_quantity} />
                    ))}
                </View>
                <Divider />
                <View style={styles.inventoryItemsContainer}>
                    <Text>{this.state.newInventoryDoc}</Text>
                </View>
            </ScrollView>
        );
    }
}

class InventoryItem extends React.Component {

    render() {
        return (
            <Card style={styles.inventoryItemCard}>
                <View style={styles.inventoryTextBlock}>
                    <Text style={styles.inventoryItemQuantity}>{this.props.itemQuantity}</Text>
                    <Text style={styles.inventoryItemName}>{this.props.itemName}</Text>
                </View>        
            </Card>
        );
        
    }
}

InventoryItem.defaultProps = {
    itemName: 'Item Name',
    itemQuantity: '##.#'
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