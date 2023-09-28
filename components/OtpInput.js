import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Text, Bold } from './Tags';

import Colors from '../constants/Colors';
import * as GlobalFunctions from '../common/GlobalFunctions'
import GS from '../common/GlobalStyles';
import { ValidationType, OtpStatus, KeyboardType } from '../constants/Enums';

const OtpInput = props => {

    const [inputValue, setInputValue] = useState();
    const [inputError, setInputError] = useState('');

    const [showButtonLoader, setShowButtonLoader] = useState(false);

    const [otpButtonText, setOtpButtonText] = useState('Send OTP');
    const [canResend, setCanResend] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(5);

    const [timerRunning, setTimerRunning] = useState(false);
    //const [remain, setRemain] = useState(30);
    //let timer = undefined;

    /*useEffect(() => {
        if (remain == 0) {
            console.log('timer - ' + props.refs[props.name + '_timer']);
            clearInterval(props.refs[props.name + '_timer']);
        }
    }, [remain]);*/


    useEffect(() => {
        if (props.submitting) {
            validateInput(inputValue);
        }

        if (props.otpStatus == OtpStatus.Sending) {
            setShowButtonLoader(true);
        }
        if (props.otpStatus == OtpStatus.Pending) {
            setShowButtonLoader(false);
        }

        if (props.shouldStartTimer) {
            setCanResend(false);
            startTimer();
        }
    }, [props]);

    const textChangeHandler = text => {
        setInputValue(text);
        props.value[props.name] = text;
        validateInput(text);
    }

    const startTimer = () => {
        console.log('starting timer for - ' + props.name);
        /*if (timer) {
            clearInterval(timer);
        }*/
        setTimerRunning(true);

        let remain = timeRemaining;
        //setRemain(timeRemaining);
        props.refs[props.name + '_timer'] = setInterval(() => {
            setShowButtonLoader(false);
            if (remain <= 0) {
                console.log('clearningg timer for - ' + props.name);
                console.log(props.refs[props.name + '_timer']);
                clearInterval(props.refs[props.name + '_timer']);
                props.refs[props.name + '_timer'] = null;
                setTimerRunning(false);
                setCanResend(true);
                setOtpButtonText('Resend');
            } else {
                //console.log('pp timer - ' + props.refs[props.name + '_timer']);
                //setRemain((remain) => remain - 1);
                remain--;
                setOtpButtonText('Send in ' + remain + ' sec.');
            }
        }, 1000);

        //timer = tmr;
    }

    const validateInput = (enteredText) => {
        if (props.validationType == ValidationType.Required) {
            if (enteredText == '' || enteredText.length != 4) {
                setInputError('Enter Valid OTP');
                props.error[props.name] = 'Enter Valid OTP';
            } else {
                setInputError('');
                props.error[props.name] = '';
            }
        }
    }

    return (
        <View style={{ ...styles.container, ...props.style }} >
            {
                props.showLabel === true &&
                <View style={GS.title_and_error}>
                    <Text style={{ ...GS.label, ...(inputError == undefined || inputError == '' ? GS.labelValid : GS.labelInvalid) }}>
                        {props.label}
                    </Text>
                    <Text style={GS.errorMessage}>
                        {inputError}
                    </Text>
                </View>
            }
            <View
                style={{
                    ...styles.addon_container,
                    ...(inputError == undefined || inputError == '' ? GS.inputValid : GS.inputInvalid),
                    marginTop: props.showLabel === true ? 0 : 15
                }}>
                <View style={{ ...styles.column, flex: 3 }}>
                    <TextInput placeholder="Enter OTP Here" onChangeText={textChangeHandler} style={styles.input}
                        keyboardType={KeyboardType.Number} maxLength={4} />
                </View>
                <View style={{ ...styles.column, flex: 1.8 }}>
                    <TouchableWithoutFeedback disabled={!canResend} onPress={props.onPress}>
                        {
                            showButtonLoader ?
                                <View style={styles.button}>
                                    <ActivityIndicator size="small" color={Colors.black} />
                                </View> :
                                <View style={styles.button} >
                                    <Bold style={{ ...styles.buttonText, ...props.textStyle }}>
                                        {otpButtonText}
                                    </Bold>
                                </View>
                        }
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    addon_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: Colors.gray,
        borderWidth: 1,
    },
    input: {
        paddingHorizontal: 10,
        height: 42,
        fontSize: 15.5,
        color: Colors.lightBlack
    },
    column: {
        height: '100%',
    },
    labelInput: {
        height: 34,
        paddingHorizontal: 10,
        paddingVertical: 2,
        fontSize: 15.5,
        textAlignVertical: 'center'
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.lightGray,
        height: '100%',
        borderLeftColor: Colors.gray,
        borderLeftWidth: 1,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    buttonText: {
        color: Colors.black2,
        fontSize: 15,
    },
});

export default OtpInput;
