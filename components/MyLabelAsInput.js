import React, { useState, useEffect } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'


import { Text, Bold } from './Tags';
import MyIcon from './MyIcon';

import Colors from '../constants/Colors';

const MyLabelAsInput = props => {

    const [inputValue, setInputValue] = useState(props.initialValue);

    return (
        <View style={styles.container}>
            {
                props.showLabel === true &&
                <View style={styles.title}>
                    <Bold style={styles.label}>
                        {props.label}
                    </Bold>
                </View>
            }
            <TextInput style={styles.input} value={inputValue} />
            {
                props.iconType &&
                <MyIcon iconType={props.iconType} name={props.iconName} style={styles.leftIcon} color={Colors.iconBlackColor} />
            }
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    title: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between'
    },
    label: {
        fontSize: 15,
        color: Colors.black2,
        paddingHorizontal: 5
    },
    input: {
        paddingVertical: 7,
        paddingLeft: 45,
        paddingRight: 10,
        minHeight: 35,
        fontSize: 15.5,
        borderColor: Colors.gray,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: Colors.offWhite
    },
    leftIcon: {
        position: 'absolute',
        top : 10,
        left: 8,
    }
})

export default MyLabelAsInput;
