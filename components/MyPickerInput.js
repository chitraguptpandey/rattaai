import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker';

import { Text, Bold } from './Tags';

import GS from '../common/GlobalStyles';
import Colors from '../constants/Colors';
import { ValidationType } from '../constants/Enums';

const MyPickerInput = props => {

    const [inputValue, setInputValue] = useState(props.initialValue || '0');
    const [inputError, setInputError] = useState('');
    const [inputRef, setInputRef] = useState();

    const setControlRef = ref => {
        setInputRef(ref);
        if (props.refs) {
            props.refs[props.name] = ref;
        }
    }

    useEffect(() => {
        if (props.initialValue != undefined && props.initialValue != '') {
            setInputValue(props.initialValue);
            props.value[props.name] = props.initialValue;
        }
        if (props.submitting) {
            validateInput(inputValue);
        }
    }, [props])

    const validateInput = value => {
        if ((value == '0' || value == undefined) && props.validationType == ValidationType.Required) {
            setInputError('This field is required');
            props.error[props.name] = 'This field is required';
        }
        else {
            setInputError('');
            props.error[props.name] = '';
        }
    }

    const valueChangeHandler = value => {
        setInputValue(value);
        props.value[props.name] = value;
        validateInput(value);
        if (props.onValueChange) {
            props.onValueChange(value);
        }
    }

    const renderPickerItems = () => {
        let items = [];
        let i = 0;

        if (props.hideSelect == undefined || props.hideSelect === false) {
            if (props.firstItemTitle) {
                items.push(
                    <Picker.Item
                        key="0"
                        label={props.firstItemTitle}
                        value="0" />
                );
            } else {
                items.push(
                    <Picker.Item
                        key="0"
                        label={"Select" + " " + props.label}
                        value="0" />
                );
            }
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
        <View style={GS.controlContainer}>
            {
                (props.showLabel === true) &&
                <View style={GS.title_and_error}>
                    <Bold style={{ ...GS.label, ...(inputError == undefined || inputError == '' ? GS.labelValid : GS.labelInvalid) }}>
                        {props.label}
                    </Bold>
                    <Text style={GS.errorMessage}>
                        {inputError}
                    </Text>
                </View>
            }
            <Picker
                {...props}
                style={{
                    ...styles.pickerContainer, ...props.pickerStyle,
                    ...(inputError == undefined || inputError == '' ? GS.inputValid : GS.inputInvalid),
                    backgroundColor: props.editable != undefined && props.editable === false ? Colors.gray : Colors.txtBoxBgColor,
                    marginTop: props.showLabel === true ? 0 : 15
                }}
                mode="dropdown"
                selectedValue={inputValue}
                onValueChange={(value) => valueChangeHandler(value)}
                textStyle={Platform.OS == 'ios' ? styles.pickerTextiOS : styles.pickerTextAndroid}
                arrowColor={Colors.black}
                enabled={!props.submitting}
                ref={ref => setControlRef(ref)}
            >
                {renderPickerItems()}
            </Picker>
        </View>
    )

}

const styles = StyleSheet.create({
    pickerTextAndroid: {
        flex: 1,
        fontSize: 24,
		marginTop: -7
        //transform: [{ scaleX: 1 }, { scaleY: 1 }]
    },
    pickerTextiOS: {
        fontSize: 15
        //transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    },
    pickerContainer: {
        height: 44,
        borderWidth: 1,
        borderColor: Colors.gray,
        fontSize: 24,
        paddingLeft: Platform.OS === 'android' ? 0 : 8,
        paddingRight: Platform.OS === 'android' ? 0 : 8,
    }
})

export default MyPickerInput;
