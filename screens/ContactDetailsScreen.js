import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import * as ExpoIconType from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import MyContainer from '../components/MyContainer';
import MyTextInput from '../components/MyTextInput';
import MyPickerInput from '../components/MyPickerInput';
import SubmitButton from '../components/SubmitButton';

import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

import Colors from '../constants/Colors';
import Variables from '../constants/Variables';

import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';
import * as profileActions from '../store/actions/profile';

const ContactDetailsScreen = props => {

	const [isLoading, setIsLoading] = useState(true);
	const [showButtonLoader, setShowButtonLoader] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	const [states, setStates] = useState();

	const dispatch = useDispatch();

	useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				const userData = await dispatch(profileActions.getProfile());

				setStates(userData.states);

				formValues['id'] = userData.profile.id;
				formValues['alternate_mobile'] = userData.profile.alternate_mobile;
				formValues['father_mobile'] = userData.profile.father_mobile;
				formValues['city'] = userData.profile.city;
				formValues['state_id'] = userData.profile.state_id;
				formValues['address'] = userData.profile.address;
				formValues['postal_code'] = userData.profile.postal_code;
				formValues['aadhar_number'] = userData.profile.aadhar_number;

				setIsLoading(false);
			} catch (err) {
				//setIsLoading(false);
				GlobalFunctions.showMessage('An Error Occurred!', err.message);
			}
		}
		getData();
	}, [dispatch, props]);

	const saveButtonClickHandler = () => {
		setIsSubmitting(true);
		setTimeout(() => {
			saveDetails();
		}, 50);
	}

	const saveDetails = async () => {
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

		setShowButtonLoader(true);

		try {
			await dispatch(profileActions.updateProfile(formValues));
			setShowButtonLoader(false);
			setIsSubmitting(false);
			GlobalFunctions.showMessage('Details Updated', 'Your Contact Details Updated Successfully', moveToProfile);
		} catch (err) {
			setShowButtonLoader(false);
			setIsSubmitting(false);
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
	}

	const moveToProfile = () => {
		setTimeout(() => {
			GlobalFunctions.navigate(props, 'Profile');
		}, 100);
	}

	if (isLoading) {
		return (
			<MyContainer navigation={props.navigation} title="Edit Contact Details" showBackIcon={true} onBackPress={moveToProfile}>
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primaryDark} />
				</View>
			</MyContainer>
		);
	}

	return (
		<MyContainer navigation={props.navigation}  showProfileDetailsSaveIcon={true} title="Edit Contact Details" saveButtonClickHandler={saveButtonClickHandler}  showBackIcon={true} onBackPress={moveToProfile}>

			<MyTextInput name="alternate_mobile" value={formValues} error={formErrors} submitting={isSubmitting}
				initialValue={formValues['alternate_mobile']} showLabel={true} label="Alternate Mobile Number"
				keyboardType={KeyboardType.Number} autoCapitalize={CapitalizeType.Words} refs={formRefs}
				maxLength={10} nextCtl="father_mobile" validationType={ValidationType.Mobile} />

			<MyTextInput name="father_mobile" value={formValues} error={formErrors} submitting={isSubmitting}
				initialValue={formValues['father_mobile']} showLabel={true} label="Father Mobile Number"
				keyboardType={KeyboardType.Number} autoCapitalize={CapitalizeType.Words} refs={formRefs}
				maxLength={10} validationType={ValidationType.Mobile} />

			<MyPickerInput name="state_id" value={formValues} error={formErrors} submitting={isSubmitting}
				initialValue={formValues['state_id']} showLabel={true} label="State" pickerData={states}
				pickerId="id" pickerValue="name" refs={formRefs} />

			<MyTextInput name="city" value={formValues} error={formErrors} submitting={isSubmitting}
				initialValue={formValues['city']} showLabel={true} label="City"
				keyboardType={KeyboardType.Default} autoCapitalize={CapitalizeType.Words} refs={formRefs}
				nextCtl="address" />

			<MyTextInput name="address" value={formValues} error={formErrors} submitting={isSubmitting}
				initialValue={formValues['address']} showLabel={true} label="Address"
				keyboardType={KeyboardType.Default} autoCapitalize={CapitalizeType.Words} refs={formRefs}
				multiline={true} numberOfLines={3} />

			<MyTextInput name="postal_code" value={formValues} error={formErrors} submitting={isSubmitting}
				initialValue={formValues['postal_code']} showLabel={true} label="Postal Code"
				keyboardType={KeyboardType.Number} refs={formRefs} maxLength={6} nextCtl="aadhar_number" />

			<MyTextInput name="aadhar_number" value={formValues} error={formErrors} submitting={isSubmitting}
				initialValue={formValues['aadhar_number']} showLabel={true} label="Aadhar Number"
				keyboardType={KeyboardType.Number} refs={formRefs} validationType={ValidationType.NumberRequired}
				minLength={12} maxLength={12} returnKeyType="done" />

			<View style={GS.formFooter}>
				{/* <SubmitButton title="Submit" onPress={saveButtonClickHandler} IsLoading={showButtonLoader}  textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.mh10, ...GS.f1, ...GS.minw100, ...GS.mb10, ...GS.rounded50 }} /> */}
			</View>

		</MyContainer>
	)
}

const styles = StyleSheet.create({

})

export default ContactDetailsScreen;
