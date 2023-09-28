import React, { useState, useEffect } from 'react';
import { View, Text as RNText, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dialog } from 'react-native-simple-dialogs';
import moment from 'moment';

import { Text, Bold } from './Tags';
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';
import MyIcon from './MyIcon';

import Colors from '../constants/Colors';
import GS from '../common/GlobalStyles';
import { ValidationType } from '../constants/Enums';

const MyDateTimePickerDialog = props => {

    const [inputValue, setInputValue] = useState(props.initialValue);
    const [inputError, setInputError] = useState('');
    const [inputRef, setInputRef] = useState();

    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [currentMode, setCurrentMode] = useState(props.mode == 'datetime' ? 'date' : props.mode);

    const [showDialog, setShowDialog] = useState(false);
    const [tempDate, setTempDate] = useState('');
    const [tempTime, setTempTime] = useState('');

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

        if ((props.mode == "date" || props.mode == "datetime") && inputValue) {
            setSelectedDateTime(new Date(inputValue));
        } else if (props.mode == "time" && inputValue) {
            setSelectedDateTime(new Date(2021, 1, 1, inputValue.split(':')[0], inputValue.split(':')[1], 0));
        } else {
            setSelectedDateTime(new Date());
        }

        if (props.submitting) {
            validateInput(inputValue);
        }
        if (props.resetting) {
            setInputValue('');
            props.value[props.name] = '';
        }
    }, [props])

    const validateInput = enteredText => {
        if (props.validationType == ValidationType.Required) {
            if (enteredText == '' || enteredText == undefined) {
                setInputError('This field is required');
                props.error[props.name] = 'This field is required';
            } else {
                setInputError('');
                props.error[props.name] = '';
            }
        }
    }

    const showDateTimePicker = () => {
        if (props.mode == 'date' || props.mode == 'datetime') {
            setCurrentMode('date');
        }

        if ((props.mode == "date" || props.mode == "datetime") && inputValue) {
            setSelectedDateTime(new Date(inputValue));
        } else if (props.mode == "time" && inputValue) {
            setSelectedDateTime(new Date(2021, 1, 1, inputValue.split(':')[0], inputValue.split(':')[1], 0));
        } else {
            setSelectedDateTime(new Date());
        }

        setShowDialog(true);
    }

    const onDateTimeChange = (event, selectedDate) => {
        let dt = '';
        let tm = '';

        if(event.type == "dismissed"){
            return;
        }

        setShowDialog(Platform.OS === 'ios');

        if (currentMode == 'date') {
            dt = moment(selectedDate).format("DD-MMM-YYYY");
            setTempDate(dt);
        } else {
            tm = moment(selectedDate).format("HH:mm");
            setTempTime(tm);
        }

        if (Platform.OS === 'android') {
            if (props.mode == 'datetime') {
                if (currentMode == 'date') {
                    setCurrentMode('time');
                    setShowDialog(true);
                } else {
                    setInputValue(tempDate + ' ' + tm);
                    props.value[props.name] = tempDate + ' ' + tm;
                }
            } else {
                if (props.mode == 'date') {
                    setInputValue(moment(selectedDate).format("DD-MMM-YYYY"));
                    props.value[props.name] = moment(selectedDate).format("DD-MMM-YYYY");
                } else {
                    setInputValue(moment(selectedDate).format("HH:mm"));
                    props.value[props.name] = moment(selectedDate).format("HH:mm");
                }
            }
        }

        if (props.mode == 'datetime') {
            if (tm == '' && inputValue) {
                setSelectedDateTime(new Date(dt + ' ' + inputValue.split(' ')[1]));
            } else if (tm == '') {
                setSelectedDateTime(new Date(dt + ' ' + moment(new Date()).format("HH:mm")));
            } else {
                setSelectedDateTime(new Date(tempDate + ' ' + tm));
            }
        } else if (props.mode == 'date') {
            setSelectedDateTime(new Date(dt + ' ' + '00:00'));
        } else if (props.mode == 'time') {
            setSelectedDateTime(new Date(2021, 1, 1, tm.split(':')[0], tm.split(':')[1], 0));
        }
    };

    const onSelectionConfirm = () => {
        if (props.mode == 'datetime') {
            if (currentMode == 'date') {
                setCurrentMode('time');
            } else {
                setInputValue(tempDate + ' ' + tempTime);
                setShowDialog(false);
                props.value[props.name] = tempDate + ' ' + tempTime;
            }
        } else if (props.mode == 'date') {
            setInputValue(tempDate);
            setShowDialog(false);
            props.value[props.name] = tempDate;
        } else if (props.mode == 'time') {
            setInputValue(tempTime);
            setShowDialog(false);
            props.value[props.name] = tempTime;
        }
    }

    const onSelectionCancel = () => {
        console.log('cancel');
        setShowDialog(false);
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
            <View
                style={{
                    ...styles.calendar,
                    ...(inputError == undefined || inputError == '' ? GS.inputValid : GS.inputInvalid),
                    backgroundColor: props.editable != undefined && props.editable === false ? Colors.gray : Colors.txtBoxBgColor,
                    marginTop: props.showLabel === true ? 0 : 15,
                    paddingLeft: props.iconType == undefined ? 10 : 45
                }}
                onTouchEnd={showDateTimePicker}>
                <RNText style={{
                    ...styles.dateText,
                    color: inputValue == undefined || inputValue == '' ? Colors.placeholder : Colors.black
                }}
                    ref={ref => setControlRef(ref)}>{inputValue == undefined || inputValue == '' ? props.placeholder : inputValue}</RNText>
            </View>
            {
                props.iconType &&
                <MyIcon iconType={props.iconType} name={props.iconName} style={{...styles.leftIcon,...props.iconStyle}} />
            }
            {
                Platform.OS == 'ios' &&
                <Dialog
                    visible={showDialog}
                    dialogStyle={{ ...styles.dialogContainer, ...props.style }}
                    contentStyle={styles.dialogContent}
                    titleStyle={{ ...styles.dialogTitleStyle, ...props.titleStyle }}
                    title={"Select " + (currentMode == 'date' ? "Date" : "Time")}
                    keyboardShouldPersistTaps="handled"
                    onTouchOutside={() => setShowDialog(false)}
                >
                    <DateTimePicker
                        value={selectedDateTime}
                        mode={currentMode}
                        is24Hour={true}
                        display="default"
                        onChange={onDateTimeChange}
                        minimumDate={props.minDate}
                        maximumDate={props.maxDate}
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 15 }}>
                        <CancelButton title="Cancel" onPress={onSelectionCancel} />
                        <SubmitButton title="Done" onPress={onSelectionConfirm} />
                    </View>
                </Dialog>
            }
            {
                Platform.OS == 'android' && showDialog &&
                <DateTimePicker
                    value={selectedDateTime}
                    mode={currentMode}
                    is24Hour={true}
                    display="default"
                    onChange={onDateTimeChange}
                    minimumDate={props.minDate}
                    maximumDate={props.maxDate}
                />
            }

        </View>
    );

};

const styles = StyleSheet.create({
    calendar: {
        width: '100%',
        minHeight: 44,
        //paddingLeft: 45,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: Colors.black,
        borderWidth: 1,
    },
    dateText: {
        fontSize: 15.5
    },
    dialogContainer: {
        height: 350,
    },
    dialogContent: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    dialogTitleStyle: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        margin: 0,
        backgroundColor: Colors.primary
    },
    leftIcon: {
        position: 'absolute',
        top: 25,
        left: 8,
    },
});

export default MyDateTimePickerDialog;
