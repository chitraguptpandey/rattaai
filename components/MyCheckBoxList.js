import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from './Tags';
import MyCheckBox from './MyCheckBox';
import Colors from '../constants/Colors';
import { ValidationType } from '../constants/Enums';

const MyCheckBoxList = props => {

    const [checkBoxesData, setCheckBoxesData] = useState(props.data);
    const [inputValue, setInputValue] = useState(props.initialValue);
    const [inputError, setInputError] = useState('');

    useEffect(() => {

        if (props.initialValue != undefined && props.initialValue != '') {
            setInputValue(props.initialValue);
            if (props.value) {
                props.value[props.name] = props.initialValue;
            }
        }
        if (props.submitting) {
            validateInput(inputValue);
        }
        if (props.resetting) {
            setInputValue('');
            if (props.value) {
                props.value[props.name] = '';
            }
            checkBoxesData.map((item) => {
                item.checked = false;
            });
        }
    }, [props])

    const validateInput = () => {
        const checkedIds = checkBoxesData.filter(x => x.checked).map((item) => { return item[props.chkId] }).join(',');

        if (checkedIds == '' && props.validationType == ValidationType.Required) {
            if (props.value) {
                props.value[props.name] = '';
            }
            if (props.error) {
                props.error[props.name] = 'Please Select at least 1 value';
            }
            setInputError('Please Select at least 1 value');
        } else {
            if (props.value) {
                props.value[props.name] = checkedIds;
            }
            if (props.error) {
                props.error[props.name] = '';
            }
            setInputError('');
        }
    }

    const selectDeselect = (item, status) => {
        item.checked = status;
        validateInput();
    }

    const renderCheckboxes = () => {
        let arrBoxes = [];

        checkBoxesData.map((item, index) => {
            arrBoxes.push(
                <MyCheckBox key={index} label={item[props.chkName]} isChecked={item.checked}
                    onCheckChanged={(status) => selectDeselect(item, status)} style={props.checkBoxStyle} />
            );
        });

        return arrBoxes;
    }

    return (
        <View style={{ ...styles.container, ...props.containerStyle }}>
            <View style={{ ...styles.inputArea, ...(inputError == undefined || inputError == '' ? styles.inputValid : styles.inputInvalid) }}>
                {
                    (props.showLabel == undefined || props.showLabel === true) &&
                    <View style={{ ...styles.labelContainerStyle, ...props.labelContainerStyle }}>
                        <Text style={styles.label}>
                            {props.label}
                        </Text>
                    </View>
                }
                <View style={{
                    ...styles.inputContainerStyle, ...props.inputContainerStyle,
                    ...(props.showLabel != undefined && props.showLabel === false ? styles.noLeftBorder : undefined),
                    ...(inputError == undefined || inputError == '' ? styles.inputValid : styles.inputInvalid)
                }}>
                    <View style={styles.checkboxContainer}>
                        {renderCheckboxes()}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    checkboxContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    inputArea: {
        flexDirection: 'row',
        marginTop: 5,
        borderWidth: 1
    },
    labelContainerStyle: {
        flex: 1.2,
        justifyContent: 'center',
    },
    inputContainerStyle: {
        flex: 2,
        minHeight: 35,
        borderLeftWidth: 1
    },
    label: {
        fontSize: 13,
        paddingHorizontal: 4,
        color: Colors.lightBlack
    },
    inputValid: {
        borderColor: Colors.black,
    },
    inputInvalid: {
        borderColor: Colors.red,
    },
    noLeftBorder: {
        borderLeftWidth: 0
    }
})

export default MyCheckBoxList;
