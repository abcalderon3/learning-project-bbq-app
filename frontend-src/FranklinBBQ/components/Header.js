import React from 'react';
import { Image, Text, SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';

export default class Header extends React.Component {
    render() {
        return(
            <Appbar.Header dark={true} style={{ justifyContent: 'center', height: 80}}>
                <Image source={require('../assets/images/franklin_logo.png')} />
            </Appbar.Header>
        );
    }
}

