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