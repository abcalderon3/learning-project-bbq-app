import firebase from 'react-native-firebase';

export const setSelectedDate = date => ({
    type: 'SET_SELECTED_DATE',
    selectedDate: date
});

export const requestInventoryItems = inventoryDayDocPath => ({
    type: 'REQUEST_INVENTORY_ITEMS',
    inventoryDayDocPath
});

export const receiveInventoryItems = inventoryItems => ({
    type: 'RECEIVE_INVENTORY_ITEMS',
    inventoryItems
});

export const getInventoryItems = inventoryDayDocPath => {
    return async (dispatch) => {
        dispatch(requestInventoryItems(inventoryDayDocPath));

        // Not elegant!
        // TODO: Either pull this out as a separate function that intelligently signs in and initializes when needed or use a middleware?
        firebase.auth().signInAnonymously();
        const firestore = firebase.firestore();

        const inventoryDayDocRef = firestore.doc(inventoryDayDocPath);

        // Gets the full set of docs in the inventory day document's items collection
        const inventoryDayItemsDocs = await inventoryDayDocRef.collection('items').get().then((querySnapshot) => { return querySnapshot.docs; } );
        
        // Gets the item reference docs
        const itemsRefDocs = await firestore.collection('item_ref').get().then((querySnapshot) => { return querySnapshot.docs; } );

        // Joins the inventory day items with item reference info
        let inventoryItems = inventoryDayItemsDocs.map(
            itemDayDoc => ({
                item_id: itemDayDoc.id,
                ...itemsRefDocs.find((itemRefDoc) => (itemRefDoc.id === itemDayDoc.id) && itemRefDoc).data(),
                ...itemDayDoc.data(),
            })
        );

        // Calculate data to be displayed
        inventoryItems = inventoryItems.map( item => ({
            ...item,
            current_item_quantity: item.start_item_quantity - item.item_quantity_change,
            current_perc_remaining: ((item.start_item_quantity - item.item_quantity_change)/item.start_item_quantity || 0)
        }));

        dispatch(receiveInventoryItems(inventoryItems));

    };
};