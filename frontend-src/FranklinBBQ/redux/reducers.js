import { combineReducers } from 'redux';
import moment from 'moment';

// In production, set this to a now moment
const today = '2017-07-20';

const todayDate = (state = today, action) => state;

const selectedDate = (state = today, action) => {
    switch (action.type) {
        case 'SET_SELECTED_DATE':
            return action.selectedDate;
        default:
            return state;
    }
};

const inventory = (state = {
    isFetching: false,
    items: []
}, action) => {
    switch (action.type) {
        case 'REQUEST_INVENTORY_ITEMS':
            return {
                ...state,
                isFetching: true
            };
        case 'RECEIVE_INVENTORY_ITEMS':
            return {
                ...state,
                isFetching: false,
                items: action.inventoryItems
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    todayDate,
    selectedDate,
    inventory
});

export default rootReducer;