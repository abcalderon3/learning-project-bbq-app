import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import { today } from '../config';

const todayDate = (state = today, action) => state;

const selectedDate = (state = today, action) => {
    switch (action.type) {
        case 'SET_SELECTED_DATE':
            return action.selectedDate;
        default:
            return state;
    }
};

const inventoryDayPaths = (state = {}, action) => {
    switch (action.type) {
        case 'REQUEST_INVENTORY_DAY':
            return state;
        case 'RECEIVE_INVENTORY_DAY':
            return {
                ...state,
                [action.inventoryDate]: action.inventoryDayPath
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    todayDate,
    selectedDate,
    inventoryDayPaths,
});

export default rootReducer;