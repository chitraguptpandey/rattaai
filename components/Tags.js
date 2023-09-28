import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';


export const Text = props => {
    return (
        <RNText {...props} style={{ ...styles.defaultFont, ...props.style }}>
            {props.children}
        </RNText>
    )
}

export const Bold = props => {
    return (
        <RNText {...props} style={{ ...styles.defaultFont, ...styles.bold, ...props.style }}>
            {props.children}
        </RNText>
    )
}

/*
export const Italic = props => {
    return (
        <RNText {...props} style={{ ...styles.defaultFont, ...styles.italic, ...props.style }}>
            {props.children}
        </RNText>
    )
}
*/

const styles = StyleSheet.create({
    defaultFont: {
        //fontSize: 16,
        fontFamily: 'Inter_Regular',
    },
    bold: {
        fontFamily: 'Inter_Bold',
        //fontWeight: 'bold'
    },
    /*italic: {
        fontStyle: 'italic'
    }*/
})
