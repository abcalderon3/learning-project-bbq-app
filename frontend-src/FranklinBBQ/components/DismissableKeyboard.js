import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

// Ensures that keyboards (esp. numeric type) are hidden when tapping outside the keyboard
const DismissableKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

export default DismissableKeyboard;