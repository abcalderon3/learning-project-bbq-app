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

const newOrder = (state = {
    order_date: today,
    party_size: 0,
    items: [],
    status: ''
}, action) => {
    switch (action.type) {
        case 'CREATE_NEW_ORDER':
            return {
                ...state,
                order_date: action.orderDate,
                status: 'open',
            };
        case 'EDIT_PARTY_SIZE':
            return {
                ...state,
                party_size: action.partySize,
            };
        case 'CREATE_UPDATE_DELETE_ITEM_IN_ORDER':
            let items = [];
            if (action.item_id && !action.item_quantity_ordered) {
                items = state.items.filter(item => item.item_id != action.item_id);
            } else if (state.items.find(item => item.item_id === action.item_id)) {
                items = state.items.map(item => {
                    return item.item_id === action.item_id ? 
                        { ...item, item_quantity_ordered: action.item_quantity_ordered } : 
                        item;
                });
            } else {
                items = [
                    ...state.items,
                    {
                        item_id: action.item_id,
                        item_quantity_ordered: action.item_quantity_ordered,
                    },
                ];
            }
            return {
                ...state,
                items
            };
        case 'BEGIN_ORDER_SUBMIT':
            return {
                ...state,
                status: 'submitting'
            };
        case 'CONFIRM_ORDER_SUBMIT':
            if (action.responseOk) {
                return {
                    ...state,
                    status: 'submitted'
                };
            } else {
                return {
                    ...state,
                    status: 'error'
                };
            }
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
    newOrder,
});

export default rootReducer;