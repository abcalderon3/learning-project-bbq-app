import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { fonts } from './fonts';

export const AppStyles = StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerContainer: {
        height: 80,
        paddingBottom: 10,
        backgroundColor: colors.primary,
    },
    defaultNavigatorCard: {
        backgroundColor: colors.background,
    },
    buttonContainer: {
      width: 200,
      marginVertical: 15,
      alignSelf: 'center',
      borderRadius: 20,
    },
    buttonLabel: {
      fontFamily: fonts.buttons,
      fontSize: 20,
      color: colors.background,
    }
  });