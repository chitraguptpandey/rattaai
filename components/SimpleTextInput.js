import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

const SimpleTextInput = props => {

    const [inputValue, setInputValue] = useState(props.initialValue ? props.initialValue.toString() : '');

    const textChangeHandler = text => {
        setInputValue(text);
        if (props.onChangeText) {
            props.onChangeText(text);
        }
    }

    return (
        <TextInput
            {...props}
            style={{ ...styles.input, ...props.style, ...(props.editable == undefined || props.editable === true ? undefined : styles.disabled) }}
            value={inputValue}
            onChangeText={textChangeHandler}
            returnKeyType={props.returnKeyType != undefined ? props.returnKeyType : "done"}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 35,
        fontSize: 15.5,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 7 : 2,
        borderWidth: 1,
        borderColor: Colors.black,
        marginHorizontal: 2
    },
    disabled:{
        backgroundColor: Colors.gray
    }
})

export default SimpleTextInput;
