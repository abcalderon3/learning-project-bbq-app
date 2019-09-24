// Joins the inventory day items with item reference info and calculates data to be displayed
export const joinInventoryItemsRef = (dailyInventoryItems, itemRef) => {
    const inventoryItems = Object.entries(dailyInventoryItems).map(
        ([itemId, itemObj]) => ({
            item_id: itemId,
            ...itemRef[itemId],
            ...itemObj,
            current_item_quantity: itemObj.start_item_quantity - itemObj.item_quantity_change,
            current_perc_remaining: ((itemObj.start_item_quantity - itemObj.item_quantity_change)/itemObj.start_item_quantity || 0)
        })
    );

    return inventoryItems;
};