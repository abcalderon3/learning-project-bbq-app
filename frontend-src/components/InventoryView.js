import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';

export class InventoryView extends React.Component {
    render() {
        return (
            <ScrollView contentContainerStyle={styles.inventoryView}>
                <View style={styles.inventoryRow}>
                    <InventoryItem />
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
    render() {
        return (
            <Card style={styles.inventoryItemCard}>
                <View style={styles.inventoryTextBlock}>
                    <Text style={{textAlign: 'center'}}>13.0</Text>
                    <Text>Brisket</Text>
                </View>        
            </Card>
        );
        
    }
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
};

const styles = StyleSheet.create(stylesSettings);