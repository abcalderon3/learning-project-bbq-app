import firebase from 'react-native-firebase';

export class FirestoreDataUtility {
    constructor() {
        // Initialize Firebase & Firestore
        firebase.auth().signInAnonymously().catch((error) => { console.log(error); });
        this.db = firebase.firestore();
        this.getInventoryDayDocument = this.getInventoryDayDocument.bind(this);
    }

    getInventoryDayDocument(inventoryDate) {
        let inventoryDayDocRef = this.db.collection('daily_inventories').doc(inventoryDate);
        
        let inventoryDayDocument = 'Promise did not execute';

        inventoryDayDocRef.get().then(
            (doc) => {
                console.log('Promise Resolved');
                inventoryDayDocument = doc.data();
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
}