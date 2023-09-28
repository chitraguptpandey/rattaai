import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from './Tags';
import Colors from '../constants/Colors';

const MyCheckBox = props => {

    const [isChecked, setIsChecked] = useState(props.isChecked);

    useEffect(() => {
        setIsChecked(props.isChecked);
    }, [props])

    const changeCheckedStatus = () => {
        const newStatus = !isChecked;
        setIsChecked(newStatus);
        if (props.onCheckChanged) {
            props.onCheckChanged(newStatus);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={changeCheckedStatus}>
            <View style={{ ...styles.touchable, ...props.style }}>
                <MaterialCommunityIcons name={isChecked ? "checkbox-outline" : "checkbox-blank-outline"}
                    color={isChecked ? Colors.primaryDark : Colors.primaryDark} size={20} />
                <Text style={{ fontSize: 15, marginLeft: 5, flexShrink: 1, lineHeight: 23 }}>{props.title}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    touchable: {
        flexDirection: 'row',
        marginVertical: 5,
        minWidth: 70,
		alignItems: 'center'
    },
    border: {
        borderWidth: 1,
        borderColor: Colors.black,
        padding: 0,
        paddingHorizontal: 0,
        paddingLeft: 0,
        paddingRight: 0
    }
})

export default MyCheckBox;
