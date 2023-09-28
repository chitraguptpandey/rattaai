import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as ExpoIconType from '@expo/vector-icons';
import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

import MyContainer from '../components/MyContainer';
import MyTextInput from '../components/MyTextInput';

import Colors from '../constants/Colors';

import * as GlobalFunctions from '../common/GlobalFunctions';
import GS from '../common/GlobalStyles';
import SubmitButton from '../components/SubmitButton';
import CancelButton from '../components/CancelButton';

import * as profileActions from '../store/actions/profile';

const ChangePasswordScreen = props => {

	const loginStateData = useSelector(state => state.login);

	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showButtonLoader, setShowButtonLoader] = useState(false);

	const [currentPassword, setCurrentPassword] = useState('');

	const [formValues, setFormValues] = useState([]);
	const [formErrors, setFormErrors] = useState([]);
	const [formRefs, setFormRefs] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				console.log('pwd - ' + loginStateData.Password);
				setCurrentPassword(loginStateData.Password);
				setIsLoading(false);
			} catch (err) {
				//setIsLoading(false);
				GlobalFunctions.showMessage('Error Occurred', err.message);
			}
		}
		getData();
	}, [dispatch, props]);

	const updateButtonClickHandler = async () => {
		setIsSubmitting(true);
		setTimeout(() => {
			updatePassword();
		}, 50);
	};

	const updatePassword = async () => {
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

		if (formValues['old_password'] != currentPassword) {
			GlobalFunctions.showMessage('Invalid Old Password', 'Old Password you have entered is not valid');
			setIsSubmitting(false);
			return;
		}

		if (formValues['old_password'] == formValues['password']) {
			GlobalFunctions.showMessage('Passwords Are Same', 'Old & New Password Must Be Different');
			setIsSubmitting(false);
			return;
		}

		if (formValues['password'] != formValues['confirm_password']) {
			GlobalFunctions.showMessage('Password Not Same', 'Password & Confirm Password Must Be Same');
			setIsSubmitting(false);
			return;
		}

		setShowButtonLoader(true);

		try {
			await dispatch(profileActions.updatePassword(formValues));
			GlobalFunctions.showMessage('Password Changed', 'Password Changed Successfully !', moveToProfile);
		} catch (err) {
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
		setShowButtonLoader(false);
		setIsSubmitting(false);
	}

	const moveToProfile = () => {
		GlobalFunctions.navigate(props, 'Profile');
	}

	if (isLoading) {
		return (
			<MyContainer title="Change Password" navigation={props.navigation} showBackIcon={true} onBackPress={moveToProfile}>
				<View style={styles.centered}>
					<ActivityIndicator size="large" color={Colors.primary} />
				</View>
			</MyContainer>
		);
	}

	return (
		<MyContainer title="Change Password" navigation={props.navigation} showBackIcon={true} onBackPress={moveToProfile}>
			<View style={{ ...GS.mh10 }}>
				<MyTextInput name="old_password" value={formValues} error={formErrors} submitting={isSubmitting}
					keyboardType={KeyboardType.Default} initialValue={formValues['old_password']} placeholder="Password"
					label="Old Password" validationType={ValidationType.Required}
					maxLength={30} refs={formRefs} nextCtl="password" autoCapitalize={CapitalizeType.None}
					iconType={ExpoIconType.MaterialIcons} iconName="lock-outline" />

				<MyTextInput name="password" value={formValues} error={formErrors} submitting={isSubmitting}
					keyboardType={KeyboardType.Default} initialValue={formValues['password']}
					label="Password" validationType={ValidationType.Required} placeholder=" Confirm Password"
					maxLength={30} refs={formRefs} nextCtl="confirm_password" autoCapitalize={CapitalizeType.None}
					iconType={ExpoIconType.MaterialIcons} iconName="lock-outline" />
				<Text>{'\n'}</Text>
				<MyTextInput name="confirm_password" value={formValues} error={formErrors} submitting={isSubmitting}
					keyboardType={KeyboardType.Default} initialValue={formValues['confirm_password']}
					label="Confirm Password" autoCapitalize={CapitalizeType.None} validationType={ValidationType.Required}
					maxLength={30} refs={formRefs} returnKeyType="done" placeholder=" Confirm typing old Password"
					iconType={ExpoIconType.MaterialIcons} iconName="lock-outline" />
				<Text>{'\n'}</Text>

				<View style={GS.formFooter}>
					<SubmitButton title="Done" IsLoading={showButtonLoader} onPress={updateButtonClickHandler} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.mh10, ...GS.f1, ...GS.minw100, ...GS.mb10, ...GS.rounded50 }} />
				</View>
				<View style={GS.formFooter}>
					<CancelButton title="Cancel" onPress={moveToProfile} style={{ ...GS.noBorder, ...GS.bgLighterGray }} />
				</View>
			</View>
		</MyContainer>
	);
}


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

export default ChangePasswordScreen;
