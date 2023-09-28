import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { MaterialIcons } from '@expo/vector-icons';

import { Text, Bold } from './Tags';

import Colors from '../constants/Colors';
import Variables from '../constants/Variables';
import { ValidationType } from '../constants/Enums';

import GS from '../common/GlobalStyles';


const MyRadioInput = props => {

    const [inputValue, setInputValue] = useState(props.initialValue);
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

    const validateInput = selectedValue => {
        if (props.validationType == ValidationType.Required) {
            if (selectedValue == '' || selectedValue == undefined) {
                setInputError('This field is required');
                props.error[props.name] = 'This field is required';
            } else {
                setInputError('');
                props.error[props.name] = '';
            }
        }
    }

    const valueChangeHandler = value => {
        setInputValue(value);
        props.value[props.name] = value;
        validateInput(value);
        if (props.onPress) {
            props.onPress(value);
        }
    }

    const renderOptions = () => {
        let lstItems = [];
        let radioOptions = props.options ? props.options : Variables.YesNoOptions;

        for (let i = 0; i < radioOptions.length; i++) {
            let val = radioOptions[i].value;
            lstItems.push(
                <View key={val} style={props.direction == "vertical" ? styles.verticalInput : undefined}>
                    <TouchableOpacity onPress={() => valueChangeHandler(val)} >
                        <View style={styles.radioInput}>
                            {
                                (inputValue == radioOptions[i].value) &&
                                <View style={styles.circle}>
                                    {
                                        <MaterialIcons name="radio-button-checked" color={Colors.primaryDark} size={20} />
                                    }
                                </View>
                            }
                            {
                                (inputValue != radioOptions[i].value) &&
                                <View style={styles.circle}>
                                    {
                                        <MaterialIcons name="radio-button-unchecked" color={Colors.primaryDark} size={20} />
                                    }
                                </View>
                            }
                            <Text style={styles.radioText}>
                                {radioOptions[i].text}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

        return lstItems;
    }

    return (
        <View style={styles.groupContainer} ref={ref => setControlRef(ref)}>
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
            <View style={{
                ...styles.buttonContainer,
                ...(props.direction == "vertical" ? styles.vertical : styles.horizontal),
                marginTop: props.showLabel === true ? 0 : 15,
                backgroundColor: Colors.txtBoxBgColor,
            }}>
                {renderOptions()}
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    groupContainer: {
        width: '100%',
    },
    buttonContainer: {
        width: '100%',
        height: 44,
        borderColor: Colors.primaryDark,
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 5
    },
    horizontal: {
        flexDirection: 'row',
    },
    vertical: {
        flexDirection: 'column',
    },
    radioInput: {
        flexDirection: 'row',
    },
    radioText: {
        marginLeft: 4,
        marginRight: 20
    },
    verticalInput: {
        marginBottom: 15
    },
    circle: {
        height: 20,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default MyRadioInput;
