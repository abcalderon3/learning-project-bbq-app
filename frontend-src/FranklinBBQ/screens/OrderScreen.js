import React, { useState, useEffect } from 'react';
import { View, Keyboard, StyleSheet } from 'react-native';
import { Text, TextInput, withTheme } from 'react-native-paper';

import DismissableKeyboard from '../components/DismissableKeyboard';

const OrderScreen = ({ inventoryItems, theme }) => {
    const [partySize, setpartySize] = useState(0);

    return (
        <DismissableKeyboard>
            <View style={{flex: 1}}>
                <PartySizeInput partySize={partySize} handlePartySizeChange={setpartySize} theme={theme} />
            </View>
        </DismissableKeyboard>
    );
};

const PartySizeInput = ({ handlePartySizeChange, theme }) => {
    const handlePartySizeInput = (event) => {
        handlePartySizeChange(parseInt(event.nativeEvent.text));
    };

    return (
        <View style={partySizeInputStyles.container}>
            <Text style={partySizeInputStyles.label}>Party Size</Text>
            <TextInput
                onEndEditing={handlePartySizeInput}
                onBlur={() => Keyboard.dismiss()}
                mode='outlined'
                keyboardType='numeric'
                clearTextOnFocus={true}
                autoFocus={true}
                style={partySizeInputStyles.textInput}
                selectionColor={theme.colors.secondary}
                theme={{ colors: { primary: theme.colors.secondary, placeholder: theme.colors.primary } }}
            />
        </View>
    );
};

const partySizeInputStyles = StyleSheet.create({
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

export default withTheme(OrderScreen);