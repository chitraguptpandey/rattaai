import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useDispatch } from 'react-redux';

import * as ExpoIconType from '@expo/vector-icons';

import Colors from '../constants/Colors';
import MyContainer from '../components/MyContainer';
import SubmitButton from '../components/SubmitButton';

import { Text, Bold } from '../components/Tags';
import MyTextInput from '../components/MyTextInput';
import MyLabelAsInput from '../components/MyLabelAsInput';
import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';
import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';

import * as loginActions from '../store/actions/login';

const ForgotPasswordScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [showButtonLoader, setShowButtonLoader] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userOtp, setUserOtp] = useState('');
    const [otpResendMessage, setOtpResendMessage] = useState('');
    const [canResend, setCanResend] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [timer, setTimer] = useState();
    const [otpValidated, setOtpValidated] = useState(false);
    const [userId, setUserId] = useState(0);

    //let timer = null;

    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [formRefs, setFormRefs] = useState({});

    const dispatch = useDispatch();

    /*useEffect(() => {
        return () => {
            console.log('ok');
            if (timer) { clearInterval(timer); }
        }
    }, []);*/

    const cancelTimer = () => {
        if (timer) { clearInterval(timer); }
    }

    const sendOtpClickHandler = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            sendOtp();
        }, 50);
    }

    const resendClickHandler = () => {
        if (!canResend) {
            return;
        }
        sendOtp();
    }

    const changeEmailClickHandler = () => {
        formValues['email'] = '';
        formValues['otp'] = '';
        if (timer) {
            clearInterval(timer);
        }
        setUserOtp('');
        setCanResend(false);
        setOtpResendMessage('');
    }

    const sendOtp = async () => {
        let formValidated = true;

        if (formErrors['email'] != '') {
            formValidated = false;
        }

        if (!formValidated) {
            GlobalFunctions.showErrorToast(() => setIsSubmitting(false));
            return;
        }

        formErrors['otp'] = '';

        setShowButtonLoader(true);

        try {
            const apiData = await dispatch(loginActions.sendForgotPwdOtp(formValues['email']));
            console.log(apiData);
            formValues['otp'] = '';
            setUserOtp(apiData.otp);
            setUserId(apiData.id);
            setIsSubmitting(false);
            setShowButtonLoader(false);
            setCanResend(false);
            startTimer();
        } catch (err) {
            setShowButtonLoader(false);
            setIsSubmitting(false);
            GlobalFunctions.showMessage('An Error Occurred!', err.message);
        }

    }

    const startTimer = () => {
        if (timer) {
            clearInterval(timer);
        }

        let remain = timeRemaining;
        let tmr = setInterval(() => {
            if (remain == 0) {
                clearInterval(timer);
                setCanResend(true);
                setOtpResendMessage('Resend');
            } else {
                remain--;
                setOtpResendMessage('You can resend after' + ' ' + remain + ' ' + 'seconds');
            }
        }, 1000);

        setTimer(tmr);
    }

    const validateOtpClickHandler = async () => {
        setShowButtonLoader(true);

        if (userOtp == formValues['otp']) {
            if (timer) {
                clearInterval(timer);
            }
            setOtpValidated(true);
            setShowButtonLoader(false);
        }
        else {
            setShowButtonLoader(false);
            GlobalFunctions.showMessage('Invalid OTP', 'Please enter a valid OTP that you would have received');
        }
    }

    const updateClickHandler = async () => {
        setIsSubmitting(true);
        setTimeout(() => {
            resetPassword();
        }, 50);
    }

    const resetPassword = async () => {
        let formValidated = true;

        if (formErrors['password'] != '') {
            formValidated = false;
        }
        if (formErrors['confirm_password'] != '') {
            formValidated = false;
        }

        if (!formValidated) {
            GlobalFunctions.showErrorToast(() => setIsSubmitting(false));
            return;
        }

        if (formValues['password'] != formValues['confirm_password']) {
            setIsSubmitting(false);
            GlobalFunctions.showMessage('Passwords Mismatch', 'Both Passwords Must Be Same');
            return;
        }

        setShowButtonLoader(true);

        try {
            formValues['id'] = userId;
            formValues['otp'] = userOtp;
            await dispatch(loginActions.resetPassword(formValues));
            setIsSubmitting(false);
            setShowButtonLoader(false);
            GlobalFunctions.showMessage('Password Changed', 'Your password has been changed successfully', openLoginScreen);
        } catch (err) {
            setIsSubmitting(false);
            setShowButtonLoader(false);
            GlobalFunctions.showMessage('An Error Occurred!', err.message);
        }
    }

    const openLoginScreen = () => {
        if (timer) {
            clearInterval(timer);
        }
        Keyboard.dismiss();
        setTimeout(() => {
            GlobalFunctions.navigate(props, 'Login');
        }, 100);
    }

    return (
        <MyContainer navigation={props.navigation} title={otpValidated ? "Reset Password" : "Forgot Password"} showBackIcon={true}
            onBackPress={openLoginScreen} cancelTimer={cancelTimer}>
            <View style={{ ...GS.scenter, ...GS.h120, ...GS.w120, ...GS.mv20 }}>
                <Image source={require('../assets/forgotlock.png')}  />
            </View>


            <View style={styles.loginSection}>

                {
                    userOtp != '' && !otpValidated &&
                    <Bold style={GS.headerLabel}>
                        {
                            userOtp == '' && !otpValidated ? "Reset your password" :
                                (userOtp != '' && !otpValidated ? "Please enter OTP" : "")
                        }
                    </Bold>
                }

                <Text style={GS.subHeaderLabel}>
                    {
                        userOtp == '' && !otpValidated ? "Enter the e-mail address associated with your account. Click submit to have your OTP e-mailed to you" :
                            (userOtp != '' && !otpValidated ? "Please check OTP sent to your email and enter here" :
                                "Please enter passwords and submit to change it")
                    }
                </Text>

                {
                    userOtp == '' && !otpValidated &&
                    <MyTextInput name="email" value={formValues} error={formErrors} submitting={isSubmitting}
                        initialValue={formValues['email']} label="Enter Email" placeholder="Enter Email"
                        validationType={ValidationType.EmailRequired} keyboardType={KeyboardType.Email}
                        autoCapitalize={CapitalizeType.None} maxLength={50} refs={formRefs} returnKeyType="done"
                        iconType={ExpoIconType.Entypo}  iconName="email" />
                }
                {
                    userOtp != '' && !otpValidated &&
                    <>
                        <MyLabelAsInput label="Email" initialValue={formValues['email']}
                            iconType={ExpoIconType.Entypo} iconName="email" />
                        <View style={{ marginBottom: 20, alignItems: 'flex-end', width: '100%' }}>
                            <TouchableWithoutFeedback onPress={changeEmailClickHandler}>
                                <Bold style={styles.resendMessage}>Change Email</Bold>
                            </TouchableWithoutFeedback>
                        </View>
                    </>
                }

                {
                    userOtp != '' && !otpValidated &&
                    <>
                        <MyTextInput name="otp" value={formValues} error={formErrors} submitting={isSubmitting} initialValue={formValues['otp']}
                            label="Enter OTP" placeholder="Enter OTP" keyboardType={KeyboardType.Number} validationType={ValidationType.NumberRequired}
                            autoCapitalize={CapitalizeType.None} maxLength={4} refs={formRefs} returnKeyType="done"
                            iconType={ExpoIconType.Foundation} iconName="key" />

                        <View style={{ alignItems: 'flex-end', width: '100%' }}>
                            <TouchableWithoutFeedback onPress={resendClickHandler}  >
                                <Bold style={styles.resendMessage}>{otpResendMessage}</Bold>
                            </TouchableWithoutFeedback>
                        </View>
                    </>
                }
                {
                    otpValidated &&
                    <>
                        <MyTextInput name="password" value={formValues} error={formErrors} submitting={isSubmitting}
                            initialValue={formValues['password']} label="Enter Password" placeholder="Enter Password"
                            validationType={ValidationType.Required} keyboardType={KeyboardType.Default}
                            autoCapitalize={CapitalizeType.None} refs={formRefs} nextCtl="confirm_password"
                            iconType={ExpoIconType.MaterialIcons} iconName="lock-outline"  />

                        <MyTextInput name="confirm_password" value={formValues} error={formErrors} submitting={isSubmitting}
                            initialValue={formValues['confirm_password']} label="Re-Enter Password" placeholder="Re-Enter Password"
                            validationType={ValidationType.Required} keyboardType={KeyboardType.Default}
                            autoCapitalize={CapitalizeType.None} refs={formRefs} returnKeyType="done"
                            iconType={ExpoIconType.MaterialIcons} iconName="lock-outline" />
                    </>
                }

                <View style={styles.formFooter}>
                    {
                        userOtp == '' && !otpValidated &&
                        <SubmitButton title="Submit" onPress={sendOtpClickHandler} IsLoading={showButtonLoader}  textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor,  ...GS.f1, ...GS.mb10 }} />
                    }
                    {
                        userOtp != '' && !otpValidated &&
                        <SubmitButton title="Validate OTP" onPress={validateOtpClickHandler} IsLoading={showButtonLoader}  textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor,  ...GS.f1, ...GS.mb10 }} />
                    }
                    {
                        otpValidated &&
                        <SubmitButton title="Submit" onPress={updateClickHandler} IsLoading={showButtonLoader}  textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor , ...GS.f1, ...GS.mb10 }} />
                    }
                </View>

            </View>

        </MyContainer>
    );
}


const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginSection: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 15,
    },
    resendMessage: {
        color: Colors.primaryDark,
        fontSize: 15,
        paddingHorizontal: 5,
        paddingVertical: 2
    },
    logo: {
        width: 80,
        height: 80,
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'center'
    },
    formHeader: {
        width: '100%',
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0,
        marginTop: 5,
        alignItems: 'center'
    },
    formFooter: {
        marginVertical: 30,
    }
})


export default ForgotPasswordScreen;
