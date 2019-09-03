import React from 'react';
import { Appbar } from 'react-native-paper';

export default class Header extends React.Component {
    render() {
        return(
            <Appbar.Header dark={true}>
                <Appbar.Content title={this.props.pageTitle} />
            </Appbar.Header>
        );
    }
}