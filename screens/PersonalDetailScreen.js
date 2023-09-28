import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import * as ExpoIconType from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import MyContainer from '../components/MyContainer';
import MyTextInput from '../components/MyTextInput';
import MyPickerInput from '../components/MyPickerInput';
import MyRadioInput from '../components/MyRadioInput';
import MyDateTimePickerDialog from '../components/MyDateTimePickerDialog';
import SubmitButton from '../components/SubmitButton';

import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

import Colors from '../constants/Colors';
import Variables from '../constants/Variables';

import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';
import * as profileActions from '../store/actions/profile';

const PersonalDetailScreen = props => {

	const [isLoading, setIsLoading] = useState(true);
	const [showButtonLoader, setShowButtonLoader] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	const dispatch = useDispatch();

	useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				const userData = await dispatch(profileActions.getProfile());
				formValues['id'] = userData.profile.id;
				formValues['name'] = userData.profile.name;
				formValues['father_name'] = userData.profile.father_name;
				formValues['dob'] = userData.profile.dob;
				formValues['caste_id'] = userData.profile.caste_id;
				formValues['gender'] = userData.profile.gender;
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
			<MyContainer navigation={props.navigation} title="Edit Personal Details" showBackIcon={true} onBackPress={moveToProfile}>
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primaryDark} />
				</View>
			</MyContainer>
		);
	}

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
			GlobalFunctions.showMessage('Details Updated', 'Your Personal Details Updated Successfully', moveToProfile);
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

	return (
		<MyContainer navigation={props.navigation} title="Edit Personal Details" showBackIcon={true}  saveButtonClickHandler={saveButtonClickHandler}  showProfileDetailsSaveIcon={true} onBackPress={moveToProfile}>
				<MyTextInput name="name" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['name']} showLabel={true} label="Full Name"
					validationType={ValidationType.Required} keyboardType={KeyboardType.Default}
					autoCapitalize={CapitalizeType.Words} refs={formRefs}
					nextCtl="father_name" />

				<MyTextInput name="father_name" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['father_name']} showLabel={true} label="Father Name"
					validationType={ValidationType.Required} keyboardType={KeyboardType.Default}
					autoCapitalize={CapitalizeType.Words} refs={formRefs} />

				<MyDateTimePickerDialog mode="date" name="dob" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['dob']} showLabel={true} label="Date of Birth" refs={formRefs} returnKeyType="done"
					minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 70))}
					maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 15))} iconType={ExpoIconType.MaterialIcons} iconName="calendar-today" iconStyle={{ ...GS.pt25, ...GS.pl5 }} />

				<MyPickerInput name="caste_id" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['caste_id']} showLabel={true} label="Category" pickerData={Variables.CasteType}
					pickerId="id" pickerValue="name" validationType={ValidationType.Required} refs={formRefs} />

				<MyRadioInput name="gender" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['gender'] == "2" ? "2" : formValues['gender'] == "3" ? "3" : "1"} validationType={ValidationType.Required}
					refs={formRefs} options={Variables.GenderOptions} showLabel={true} label="Gender" />

				<View style={GS.formFooter}>
					{/* <SubmitButton title="Submit" onPress={saveButtonClickHandler} IsLoading={showButtonLoader} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.mh10, ...GS.f1, ...GS.minw100, ...GS.mb10, ...GS.rounded50 }} /> */}
				</View>
		</MyContainer>
	)
}

const styles = StyleSheet.create({

})

export default PersonalDetailScreen;
