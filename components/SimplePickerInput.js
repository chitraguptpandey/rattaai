import React, { useState } from 'react'
import { StyleSheet, Platform } from 'react-native'
import { Picker } from 'react-native-picker-dropdown';

import Colors from '../constants/Colors';

const SimplePickerInput = props => {

    const [inputValue, setInputValue] = useState(props.initialValue ? props.initialValue : "0");

    const valueChangeHandler = value => {
        setInputValue(value);
        if (props.onValueChange) {
            props.onValueChange(value);
        }
    }

    const renderPickerItems = () => {
        let items = [];
        let i = 0;

        if (props.firstItemTitle) {
            items.push(
                <Picker.Item
                    key="0"
                    label={props.firstItemTitle}
                    value="0" />
            );
        } else if (props.showSelectOption == undefined || props.showSelectOption === true) {
            items.push(
                <Picker.Item
                    key="0"
                    label={props.label}
                    value="0" />
            );
        }

        for (i = 0; i < props.pickerData.length; i++) {
            items.push(
                <Picker.Item
                    key={props.pickerData[i][props.pickerId]}
                    label={props.pickerData[i][props.pickerValue]}
                    value={props.pickerData[i][props.pickerId].toString()} />
            );
        }

        return items;
    }

    return (
        <Picker
            {...props}
            style={styles.pickerContainer}
            mode="dropdown"
            selectedValue={inputValue}
            onValueChange={(value) => valueChangeHandler(value)}
            textStyle={Platform.OS == 'ios' ? styles.pickerTextiOS : styles.pickerTextAndroid}
            arrowColor={Colors.black}
        >
            {renderPickerItems()}
        </Picker>
    );

}

const styles = StyleSheet.create({
    pickerContainer: {
        flex: 1,
        height: 35,
        borderWidth: 1,
        borderColor: Colors.black,
        fontSize: 24,
        paddingLeft: Platform.OS === 'android' ? 0 : 8,
        paddingRight: Platform.OS === 'android' ? 0 : 8,
        marginRight: 0
    },
    pickerTextAndroid: {
        flex: 1,
        fontSize: 15,
        //transform: [{ scaleX: 1 }, { scaleY: 1 }]
    },
    pickerTextiOS: {
        fontSize: 15,
        color: Colors.lightBlack
        //transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    },
})

export default SimplePickerInput;
