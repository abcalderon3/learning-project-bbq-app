const config = {
    serviceUrl: 'http://127.0.0.1:5000/',
    enabled: false
};

export class InventoryServiceUtility {
    constructor() {
        this.config = config;
    }

    // Get the inventory day document path for a given date (expecting backend to create if it doesn't exist)
    async getInventoryDay(inventoryDate) {
        let inventoryDayDocPath = await fetch(
            this.config.serviceUrl + 'create_day',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: inventoryDate
                })
            }
        )
        .then((response) => response.json())
        .catch((error) => { console.error(error); });

        return inventoryDayDocPath;
    }
}