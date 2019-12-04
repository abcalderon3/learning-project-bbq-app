import { inventoryServiceConfig } from '../config';

export const setSelectedDate = date => ({
    type: 'SET_SELECTED_DATE',
    selectedDate: date
});


export const requestInventoryDay = inventoryDate => ({
    type: 'REQUEST_INVENTORY_DAY',
    inventoryDate
});

export const receiveInventoryDay = (inventoryDate, inventoryDayPath) => ({
    type: 'RECEIVE_INVENTORY_DAY',
    inventoryDate,
    inventoryDayPath,
});

export const getInventoryDay = inventoryDate => {
    return dispatch => {
        dispatch(requestInventoryDay(inventoryDate));

        if (inventoryServiceConfig.enabled) {
            return fetch(
                inventoryServiceConfig.serviceUrl + 'create_day',
                {
                    method: 'POST',
                    headers: inventoryServiceConfig.commonHeaders,
                    body: JSON.stringify({
                        date: inventoryDate
                    })
                }
            )
                .then(response => response.json())
                .then(inventoryDayPath => dispatch(receiveInventoryDay(inventoryDate, inventoryDayPath)));

        } else {
            return dispatch(receiveInventoryDay(inventoryDate, 'daily_inventories/' + inventoryDate));
        }

    };
};


export const createNewOrder = (orderDate) => ({
    type: 'CREATE_NEW_ORDER',
    orderDate
});

export const editPartySize = (partySize) => ({
    type: 'EDIT_PARTY_SIZE',
    partySize
});

// To delete an item from the order, use this action with itemQuantityOrdered = 0
export const cudItemInOrder = (item_id, item_quantity_ordered) => ({
    type: 'CREATE_UPDATE_DELETE_ITEM_IN_ORDER',
    item_id,
    item_quantity_ordered,
});

export const beginOrderSubmit = () => ({
    type: 'BEGIN_ORDER_SUBMIT',
});

export const confirmOrderSubmit = (responseOk) => ({
    type: 'CONFIRM_ORDER_SUBMIT',
    responseOk
});

export const submitNewOrder = () => {
    return (dispatch, getState) => {
        dispatch(beginOrderSubmit());

        const newOrder = getState().newOrder;

        if (inventoryServiceConfig.enabled) {
            return fetch(
                inventoryServiceConfig.serviceUrl + 'create_new_order',
                {
                    method: 'POST',
                    headers: inventoryServiceConfig.commonHeaders,
                    body: JSON.stringify({
                        date: newOrder.order_date,
                        party_size: newOrder.party_size,
                        items: newOrder.items,
                    })
                }
            )
                .then(response => dispatch(confirmOrderSubmit(response.ok)));

        } else {
            return dispatch(confirmOrderSubmit(true));
        }

    };
};

export const orderActions = {
    createNewOrder,
    editPartySize,
    cudItemInOrder,
    submitNewOrder,
};