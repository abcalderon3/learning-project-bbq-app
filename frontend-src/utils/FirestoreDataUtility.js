import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCQ1KLql2Qd_WBZXyY3D1kv9UurK-XvzI8",
    authDomain: "ryac-44926.firebaseapp.com",
    databaseURL: "https://ryac-44926.firebaseio.com",
    projectId: "ryac-44926",
    storageBucket: "ryac-44926.appspot.com",
    messagingSenderId: "626469166913",
    appId: "1:626469166913:web:e10404c25273d9b1"
};

export class FirestoreDataUtility {
    constructor() {
        // Initialize Firebase & Firestore
        !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
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