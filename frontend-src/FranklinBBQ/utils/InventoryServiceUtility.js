const config = {
    serviceUrl: 'http://127.0.0.1:5000/',
    enabled: false
};

const commonHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

class InventoryServiceUtility {
    constructor() {
        this.config = config;
    }

    // Get the inventory day document path for a given date (expecting backend to create if it doesn't exist)
    async getInventoryDay(inventoryDateString) {
        let inventoryDayDocPath = await fetch(
            this.config.serviceUrl + 'create_day',
            {
                method: 'POST',
                headers: commonHeaders,
                body: JSON.stringify({
                    date: inventoryDateString
                })
            }
        )
        .then((response) => response.json())
        .catch((error) => { console.error(error); });

        return inventoryDayDocPath;
    }

    // Call backend to update the Starting Item Quantity for the specified Inventory Day
    async updateItemStartQuantity(inventoryDateString, itemId, newItemStartQuantity) {
        const requestBody = {
            item_id: itemId,
            start_item_quantity: newItemStartQuantity,
        };

        let responseStatus = await fetch(
            this.config.serviceUrl + inventoryDateString,
            {
                method: 'PUT',
                headers: commonHeaders,
                body: JSON.stringify(requestBody)
            }
        )
        .then(response => response.status)
        .catch(error => console.error(error));

        return responseStatus === 201 ? true : false;
    }
};

class InventoryServiceUtilityStub extends InventoryServiceUtility {
    getInventoryDay(inventoryDateString) {
        return 'daily_inventories/' + inventoryDateString;
    }

    updateItemStartQuantity() {
        return true;
    }

}

// Exports the real Inventory Service Utility if backend is enabled; otherwise, provides the stub
let UtilityExported = config.enabled ? InventoryServiceUtility : InventoryServiceUtilityStub;
export default UtilityExported;