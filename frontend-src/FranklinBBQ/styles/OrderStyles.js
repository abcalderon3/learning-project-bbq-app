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
    orderedQuantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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

// OrderManagement Screen List Styles
export const OrderMgmtListItemStyles = StyleSheet.create({
  rightText: {
  },
  rightNodeContainer: {
      justifyContent: 'center',
      marginVertical: 1,
      width: '80%',
  },
  leftNodeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 2,
  },
  listItem: {
      marginHorizontal: 5,
      padding: 1,
      borderColor: colors.secondary,
      borderBottomWidth: 1,
      maxWidth: '95%',
  },
  displayOrder: {
      textAlign: 'center',
      textAlignVertical: 'center',
  },
  listItemSelected: {
      borderColor: colors.secondary,
      borderWidth: 1,
  },
  listContainer: {
      marginVertical: 10,
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