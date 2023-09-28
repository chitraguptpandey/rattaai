import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as ExpoIconType from '@expo/vector-icons';


import { ValidationType, KeyboardType, CapitalizeType, OtpStatus } from '../constants/Enums';

import { Text, Bold } from '../components/Tags';
import MyContainer from '../components/MyContainer';
import MyTextInput from '../components/MyTextInput';
import MyCheckBox from '../components/MyCheckBox';
import SubmitButton from '../components/SubmitButton';
import CancelButton from '../components/CancelButton';

import Colors from '../constants/Colors';

import * as GlobalFunctions from '../common/GlobalFunctions';
import GS from '../common/GlobalStyles';
import * as profileActions from '../store/actions/profile';

const AccountDetailScreen = props => {

	const loginStateData = useSelector(state => state.login);

	const timerInterval = 60;

	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [showButtonLoader, setShowButtonLoader] = useState(false);

	const [emailChangeRequired, setEmailChangeRequired] = useState(false);
	const [mobileChangeRequired, setMobileChangeRequired] = useState(false);

	const [shouldStartEmailTimer, setShouldStartEmailTimer] = useState(false);
	const [shouldStartMobileTimer, setShouldStartMobileTimer] = useState(false);

	const [emailOtpStatus, setEmailOtpStatus] = useState(OtpStatus.Pending);
	const [mobileOtpStatus, setMobileOtpStatus] = useState(OtpStatus.Pending);

	const [sentEmailOtp, setSentEmailOtp] = useState('');
	const [sentMobileOtp, setSentMobileOtp] = useState('');

	const [enteredEmailOtp, setEnteredEmailOtp] = useState('');
	const [enteredMobileOtp, setEnteredMobileOtp] = useState('');

	const [currentEmail, setCurrentEmail] = useState('');
	const [currentMobile, setCurrentMobile] = useState('');

	const [mobileOtpButtonText, setMobileOtpButtonText] = useState('Send');
	const [emailOtpButtonText, setEmailOtpButtonText] = useState('Send');

	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	const dispatch = useDispatch();

	let mobileTimer = null;
	let emailTimer = null;

	useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {

				formValues['id'] = loginStateData.StudentId;
				formValues['mobile'] = loginStateData.Mobile;
				formValues['email'] = loginStateData.Email;

				setCurrentEmail(loginStateData.Email);
				setCurrentMobile(loginStateData.Mobile);

				setIsLoading(false);
			} catch (err) {
				//setIsLoading(false);
				GlobalFunctions.showMessage('An Error Occurred!', err.message);
			}
		}
		getData();
	}, [dispatch, props]);

	
	if (isLoading) {
		return (
			<MyContainer navigation={props.navigation} title="Edit Account Details" showBackIcon={true} onBackPress={moveToProfile}>
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primary} />
				</View>
			</MyContainer>
		);
	}

	const emailChangeClickHandler = (checked) => {
		if (!checked) {
			formValues['email'] = currentEmail;
			formErrors['email'] = '';
			formValues['email_otp'] = '';
			formErrors['email_otp'] = '';
		} else {
			formValues['email'] = '';
		}
		setEmailOtpStatus(OtpStatus.Pending);
		setEmailChangeRequired(checked);
	}

	const mobileChangeClickHandler = (checked) => {
		if (!checked) {
			formValues['mobile'] = currentMobile;
			formErrors['mobile'] = '';
			formValues['mobile_otp'] = '';
			formErrors['mobile_otp'] = '';
		} else {
			formValues['mobile'] = '';
		}
		setMobileOtpStatus(OtpStatus.Pending);
		setMobileChangeRequired(checked);
	}

	const sendMobileOtpClickHandler = () => {
		setIsSubmitting(true);
		setTimeout(() => {
			sendMobileOtp();
		}, 100);
	}

	const sendMobileOtp = async () => {
		if (formErrors['mobile'] != '') {
			GlobalFunctions.showErrorToast(() => setIsSubmitting(false));
			return;
		}

		if (formValues['mobile'] == currentMobile) {
			GlobalFunctions.showMessage('No Change Found', 'Your Entered Mobile Is Same As Earlier');
			return;
		}

		setIsSubmitting(false);

		try {
			setMobileOtpStatus(OtpStatus.Sending);
			const otp = await dispatch(profileActions.sendMobileOtp(formValues['mobile']));
			setSentMobileOtp(otp);
			setMobileOtpStatus(OtpStatus.Sent);
			startMobileOtpTimer();
		} catch (err) {
			setMobileOtpStatus(OtpStatus.Pending);
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
	}


	const startMobileOtpTimer = () => {
		let remain = timerInterval;
		mobileTimer = setInterval(() => {
			if (remain <= 0) {
				if (mobileTimer != null) {
					clearInterval(mobileTimer);
				}
				setMobileOtpButtonText('Resend');
				setMobileOtpStatus(OtpStatus.Pending);
			} else {
				remain--;
				setMobileOtpButtonText('Send in ' + remain + ' sec.');
			}
		}, 1000);
	}

	const startEmailOtpTimer = () => {
		let remain = timerInterval;
		emailTimer = setInterval(() => {
			setShowButtonLoader(false);
			if (remain <= 0) {
				if (emailTimer != null) {
					clearInterval(emailTimer);
				}
				setEmailOtpButtonText('Resend');
				setEmailOtpStatus(OtpStatus.Pending);
			} else {
				remain--;
				setEmailOtpButtonText('Send in ' + remain + ' sec.');
			}
		}, 1000);
	}



	const sendEmailOtpClickHandler = () => {
		setIsSubmitting(true);
		setTimeout(() => {
			sendEmailOtp();
		}, 100);
	}

	const sendEmailOtp = async () => {
		if (formErrors['email'] != '') {
			GlobalFunctions.showErrorToast(() => setIsSubmitting(false));
			return;
		}

		if (formValues['email'] == currentEmail) {
			GlobalFunctions.showMessage('No Change Found', 'Your Entered Email Is Same As Earlier');
			return;
		}

		setIsSubmitting(false);

		try {
			setEmailOtpStatus(OtpStatus.Sending);
			const otp = await dispatch(profileActions.sendEmailOtp(formValues['email']));
			setSentEmailOtp(otp);
			setEmailOtpStatus(OtpStatus.Sent);
			startEmailOtpTimer();
		} catch (err) {
			setEmailOtpStatus(OtpStatus.Pending);
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
	}

	const updateButtonClickHandler = async () => {
		setIsSubmitting(true);
		setTimeout(() => {
			updateAccount();
		}, 100);
	};

	const updateAccount = async () => {
		let formValidated = true;

		for (let fe in formErrors) {
			if (formErrors[fe] != '') {
				console.log(fe + ' - ' + formErrors[fe]);
				formValidated = false;
				break;
			}
		}

		if (!formValidated) {
			GlobalFunctions.showErrorToast(() => setIsSubmitting(false));
			return;
		}

		if (mobileChangeRequired && enteredMobileOtp == '') {
			GlobalFunctions.showMessage('Invalid OTP', 'Please Enter Valid Mobile OTP');
			setIsSubmitting(false);
			return;
		}

		if (emailChangeRequired && enteredEmailOtp == '') {
			GlobalFunctions.showMessage('Invalid OTP', 'Please Enter Valid Email OTP');
			setIsSubmitting(false);
			return;
		}

		if (mobileChangeRequired && enteredMobileOtp != sentMobileOtp) {
			GlobalFunctions.showMessage('Invalid OTP', 'The Mobile OTP you have entered is not valid');
			setIsSubmitting(false);
			return;
		}

		if (emailChangeRequired && enteredEmailOtp != sentEmailOtp) {
			GlobalFunctions.showMessage('Invalid OTP', 'The Email OTP you have entered is not valid');
			setIsSubmitting(false);
			return;
		}

		if (mobileChangeRequired) {
			formValues['mobile_otp'] = enteredMobileOtp;
		}

		if (emailChangeRequired) {
			formValues['email_otp'] = enteredEmailOtp;
		}

		setIsSubmitting(false);
		setShowButtonLoader(true);

		try {
			const apiData = await dispatch(profileActions.updateAccount(formValues));
			setCurrentEmail(apiData.email);
			setCurrentMobile(apiData.mobile);

			if (mobileTimer != null) {
				clearInterval(mobileTimer);
				mobileTimer = null;
			}
			if (emailTimer != null) {
				clearInterval(emailTimer);
				emailTimer = null;
			}

			GlobalFunctions.showMessage('Account Updated', 'Account Details Updated Successfully !');

			setTimeout(() => {
				setMobileChangeRequired(false);
				setEmailChangeRequired(false);
			}, 100);

		} catch (err) {
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
		setShowButtonLoader(false);
		setIsSubmitting(false);
	}

	const moveToProfile = () => {
		if (mobileTimer != null) {
			clearInterval(mobileTimer);
			mobileTimer = null;
		}
		if (emailTimer != null) {
			clearInterval(emailTimer);
			emailTimer = null;
		}

		setTimeout(() => {
			GlobalFunctions.navigate(props, 'Profile');
		}, 100);

	}


	return (
		<MyContainer navigation={props.navigation} title="Edit Account Details" showBackIcon={true} onBackPress={moveToProfile}>

			<MyCheckBox title="Change Mobile" isChecked={mobileChangeRequired} onCheckChanged={mobileChangeClickHandler} />

			<MyTextInput name="mobile" value={formValues} error={formErrors} submitting={isSubmitting}
				keyboardType={KeyboardType.Number} initialValue={formValues['mobile']} label="Enter Mobile" placeholder="Enter Mobile"
				validationType={ValidationType.MobileRequired} maxLength={10} refs={formRefs} nextCtl="email"
				editable={mobileChangeRequired && mobileOtpStatus == OtpStatus.Pending}
				iconType={ExpoIconType.MaterialCommunityIcons} iconName="cellphone-iphone" />

			{
				mobileChangeRequired &&
				<View style={otpStyles.container} >
					<View
						style={{ ...otpStyles.addon_container, ...GS.inputValid, ...GS.mt15 }}>
						<View style={{...otpStyles.column, flex: 3}}>
							<TextInput placeholder="Enter OTP Here" onChangeText={(text) => setEnteredMobileOtp(text)} style={otpStyles.input}
								keyboardType={KeyboardType.Number} maxLength={4} />
						</View>
						<View style={{...otpStyles.column, flex: 1.8}}>
							<TouchableWithoutFeedback disabled={mobileOtpStatus != OtpStatus.Pending} onPress={sendMobileOtpClickHandler}>
								{
									mobileOtpStatus == OtpStatus.Sending ?
										<View style={otpStyles.button}>
											<ActivityIndicator size="small" color={Colors.black} />
										</View> :
										<View style={otpStyles.button} >
											<Bold style={otpStyles.buttonText}>
												{mobileOtpButtonText}
											</Bold>
										</View>
								}
							</TouchableWithoutFeedback>
						</View>
					</View>
				</View>
			}

			<MyCheckBox title="Change Email" isChecked={emailChangeRequired} onCheckChanged={emailChangeClickHandler}
				style={{ marginTop: 40 }} />

			<MyTextInput name="email" value={formValues} error={formErrors} submitting={isSubmitting}
				keyboardType={KeyboardType.Email} autoCapitalize={CapitalizeType.None} initialValue={formValues['email']}
				label="Enter Email" placeholder="Enter Email" validationType={ValidationType.EmailRequired} maxLength={50} refs={formRefs}
				editable={emailChangeRequired && emailOtpStatus == OtpStatus.Pending}
				iconType={ExpoIconType.MaterialCommunityIcons} iconName="email-outline" />

			{
				emailChangeRequired &&
				<View style={otpStyles.container} >
					<View
						style={{ ...otpStyles.addon_container, ...GS.inputValid, ...GS.mt15 }}>
						<View style={{...otpStyles.column, flex: 3}}>
							<TextInput placeholder="Enter OTP Here" onChangeText={(text) => setEnteredEmailOtp(text)} style={otpStyles.input}
								keyboardType={KeyboardType.Number} maxLength={4} />
						</View>
						<View style={{...otpStyles.column, flex: 1.8}}>
							<TouchableWithoutFeedback disabled={emailOtpStatus != OtpStatus.Pending} onPress={sendEmailOtpClickHandler}>
								{
									emailOtpStatus == OtpStatus.Sending ?
										<View style={otpStyles.button}>
											<ActivityIndicator size="small" color={Colors.black} />
										</View> :
										<View style={otpStyles.button} >
											<Bold style={otpStyles.buttonText}>
												{emailOtpButtonText}
											</Bold>
										</View>
								}
							</TouchableWithoutFeedback>
						</View>
					</View>
				</View>
			}


			<View style={GS.formFooter}>
				{
					(mobileChangeRequired || emailChangeRequired) &&
					<SubmitButton title="Update" IsLoading={showButtonLoader} onPress={updateButtonClickHandler}  textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.mh10, ...GS.f1, ...GS.minw100, ...GS.mb10, ...GS.rounded50 }} />
				}
				<CancelButton title="Cancel" onPress={moveToProfile}  textStyle={{ ...GS.textWhite }} style={{ ...GS.bgLightGreen, ...GS.mh10, ...GS.f1, ...GS.minw100, ...GS.mb10, ...GS.rounded50 }} />
			</View>

		</MyContainer>
	)
}


const otpStyles = StyleSheet.create({
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


const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		paddingHorizontal: 20,
		alignItems: "center",
		flexDirection: 'column',
		marginTop: 10
	},
	textBoxContainer: {
		marginTop: 30
	},
	textBox: {
		width: '100%',
		fontSize: 18,
		marginTop: 5,
		borderBottomColor: Colors.darkGreen,
		borderBottomWidth: 2
	},
	buttonContainer: {
		width: '100%',
		flex: 1,
		alignItems: "center",
		marginTop: 30
	}
});

export default AccountDetailScreen;
