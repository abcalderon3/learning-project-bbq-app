import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { fonts } from './fonts';

export const partySizeInputStyles = StyleSheet.create({
    container: {
        flexDirection:'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    label: {
        flex: 3,
        fontSize: 20, 
        textAlign: 'center',
    },
    textInput: {
        flex: 1,
    },
});

export const listItemStyles = StyleSheet.create({
    listItem: {
        borderWidth: 0.2,
        borderRadius: 10,
        marginBottom: 5,
        marginHorizontal: 5,
        padding: 2,
    },
    listItemSelected: {
        borderColor: colors.secondary,
        borderWidth: 1,
    },
    listItemOrdered: {
        borderColor: colors.primary,
        borderWidth: 1,
    },
    displayQuantityContainer: {
        borderRadius: 10,
        backgroundColor: colors.inlineInput,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 10,
        padding: 4,
        width: 40,
    },
    displayQuantity: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 18,
    },
    quantityInput: {
        marginRight: 10,
        width: 40,
        padding: 6,
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'center',
        backgroundColor: colors.inlineInput,
        fontFamily: fonts.regular,
        borderRadius: 10,
        color: colors.secondary,
    },
});

export const OrderDrawer = StyleSheet.create({
    view: {
        borderBottomWidth: 0.2,
        paddingBottom: 10,
        marginBottom: 15,
    },
});

export const button = StyleSheet.create({
    container: {
        width: 200,
        marginVertical: 15,
        alignSelf: 'center',
    },
    label: {
        fontFamily: fonts.buttons,
        fontSize: 20,
        color: colors.background,
    },
});