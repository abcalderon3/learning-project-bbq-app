import { colors } from './colors';

export const remainingColor = (itemPercentRemaining) => {
    let remainingColor = colors.quantity.gray;
    if(itemPercentRemaining >= 0.75) {
        remainingColor = colors.quantity.green;
    } else if (itemPercentRemaining >= 0.25) {
        remainingColor = colors.quantity.yellow;
    } else if (itemPercentRemaining > 0) {
        remainingColor = colors.quantity.red;
    }
    return remainingColor;
};

export const dynamicQtyBackgroundColor = (itemPercentRemaining) => { 
    return { backgroundColor: remainingColor(itemPercentRemaining) }; 
};

