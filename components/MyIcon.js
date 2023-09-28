import React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

const MyIcon = props => {

    const CurrentIcon = props.iconType ? props.iconType : Ionicons;

    return (
        <CurrentIcon
            name={props.name}
            size={props.size ? props.size : 24}
            color={props.color ? props.color : Colors.darkGray}
            style={{ ...styles.menuIcon, ...props.style }} />
    )
}

const styles = StyleSheet.create({
    menuIcon: {
        marginRight: 8
    }
})

export default MyIcon;
