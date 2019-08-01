import firebase from 'react-native-firebase';

export class FirestoreDataUtility {
    constructor() {
        firebase.auth().signInAnonymously().catch((error) => { console.log(error); });
        this.db = firebase.firestore();
    }

    async getInventoryDayDocument(inventoryDate) {
        let inventoryDayDocRef = this.db.collection('daily_inventories').doc(inventoryDate);
        
        let inventoryDayDocument = 'Promise did not execute';

        await inventoryDayDocRef.get().then(
            (doc) => {
                console.log('Promise Resolved');
                inventoryDayDocument = doc.data();
                console.log(inventoryDayDocument);
            },
            () => {
                console.log('Promise Rejected');
                inventoryDayDocument = 'Promise Rejected';
            }
        ).catch((error) => {
             console.log(error); 
             inventoryDayDocument = 'Promise Errored';
        });

        return inventoryDayDocument;
    }

    // Gets items from an inventory day document with reference data
    async getInventoryItems(inventoryDayDocPath) {
        let inventoryDayDocRef = this.db.doc(inventoryDayDocPath);
        
        // Gets the full set of docs in the inventory day document's items collection
        let inventoryDayItemsDocs = await inventoryDayDocRef.collection('items').get().then((querySnapshot) => { return querySnapshot.docs; } );
        
        // Gets the item reference docs
        let itemsRefDocs = await this.db.collection('item_ref').get().then((querySnapshot) => { return querySnapshot.docs; } );

        // Joins the inventory day items with item reference info
        let inventoryItems = inventoryDayItemsDocs.map(
            itemDayDoc => ({
                item_id: itemDayDoc.id,
                ...itemsRefDocs.find((itemRefDoc) => (itemRefDoc.id === itemDayDoc.id) && itemRefDoc).data(),
                ...itemDayDoc.data(),
            })
        );

        return inventoryItems;
    }
}