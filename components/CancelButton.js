import React from 'react';
import { View, ActivityIndicator, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import { Text, Bold } from './Tags';
import Colors from '../constants/Colors';

const CancelButton = props => {

    return (
        <TouchableWithoutFeedback disabled={props.disabled || props.IsLoading} onPress={props.onPress}>
            <View style={{ ...styles.button, backgroundColor: props.disabled ? Colors.white : Colors.gray, ...props.style }}>
                {
                    props.IsLoading ?
                        <View style={styles.container}>
                            <ActivityIndicator size="small" color={Colors.black} />
                        </View> :
                        <View style={styles.container}>
                            <Text style={{ ...styles.buttonText, ...props.textStyle }}>{props.title}</Text>
                        </View>
                }
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center"
    },
    button: {
        minWidth: 110,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.gray,
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 5,
        paddingHorizontal: 15
    },
    buttonText: {
        color: Colors.black,
        fontSize: 18,
    }
});


export default CancelButton;
