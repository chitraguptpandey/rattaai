import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { Text, Bold } from './Tags';
import Colors from '../constants/Colors';

const SubmitButton = props => {

    return (
        <TouchableWithoutFeedback disabled={props.disabled || props.IsLoading} onPress={props.onPress} >
            <View style={{ ...styles.buttonContainer, ...props.style }}>
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
    buttonContainer: {
        minWidth: 110,
        height: 45,
        borderWidth: 1,
        backgroundColor: Colors.btnColor,
        borderColor: Colors.btnBorderColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 49,
        paddingHorizontal: 15
    },
    buttonTouchable: {
        width: '100%',
        height: '100%',
        justifyContent: "center",
    },
    buttonText: {
        color: Colors.black,
        fontSize: 18,
    }
});


export default SubmitButton;
