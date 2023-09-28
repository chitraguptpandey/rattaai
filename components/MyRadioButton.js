// MyRadioButton.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback,Text } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const MyRadioButton = props => {
    const [isSelected, setIsSelected] = useState(props.isSelected);

    useEffect(() => {
        setIsSelected(props.isSelected);
    }, [props])

    const changeSelectedStatus = () => {
        if (props.onSelectedChanged) {
            props.onSelectedChanged(!isSelected);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={changeSelectedStatus}>
            <View style={{ ...styles.touchable, ...props.style }}>
                <MaterialCommunityIcons 
                    name={isSelected ? "radiobox-marked" : "radiobox-blank"} 
                    color={isSelected ? Colors.primaryDark : Colors.primaryDark} 
                    size={20} 
                />
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
    }
})

export default MyRadioButton;
