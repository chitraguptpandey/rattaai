import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import * as ExpoIconType from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import MyContainer from '../components/MyContainer';
import MyTextInput from '../components/MyTextInput';
import MyPickerInput from '../components/MyPickerInput';
import MyDateTimePickerDialog from '../components/MyDateTimePickerDialog';
import SubmitButton from '../components/SubmitButton';

import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

import Colors from '../constants/Colors';
import Variables from '../constants/Variables';

import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';
import * as profileActions from '../store/actions/profile';
import CardView from '../components/CardView';

const EducationDetailScreen = props => {

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
				formValues['tenth_year'] = userData.profile.tenth_year;
				formValues['twelfth_subject'] = userData.profile.twelfth_subject;
				formValues['twelfth_year'] = userData.profile.twelfth_year;
				formValues['bachelors_degree'] = userData.profile.bachelors_degree;
				formValues['bachelors_year'] = userData.profile.bachelors_year;
				formValues['masters_degree'] = userData.profile.masters_degree;
				formValues['masters_year'] = userData.profile.masters_year;
				formValues['bed_year'] = userData.profile.bed_year;
				formValues['net_jrf_year'] = userData.profile.net_jrf_year;
				formValues['others'] = userData.profile.others;
				formValues['others_year'] = userData.profile.others_year;
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
			<MyContainer navigation={props.navigation} title="Edit Education Details" showBackIcon={true} onBackPress={moveToProfile}>
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
			GlobalFunctions.showMessage('Details Updated', 'Your Education Details Updated Successfully', moveToProfile);
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
		<MyContainer navigation={props.navigation} title="Edit Education Details"  saveButtonClickHandler={saveButtonClickHandler} showProfileDetailsSaveIcon={true} showBackIcon={true} onBackPress={moveToProfile}>

			<MyTextInput name="tenth_year" value={formValues} error={formErrors} submitting={isSubmitting}
				initialValue={formValues['tenth_year']} showLabel={true} label="Year of 10th Class"
				keyboardType={KeyboardType.Number} refs={formRefs} maxLength={4}
				nextCtl="twelfth_subject" textInputStyle={{ ...GS.mh15, ...GS.mt10 }} lebelStyle={{ ...GS.mh15 }}  iconType={ExpoIconType.MaterialIcons} iconName="calendar-today" iconStyle={{...GS.pt30 ,...GS.pl15 }}/>
			<CardView>
				<MyTextInput name="twelfth_subject" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['twelfth_subject']} showLabel={true} label="Subject in 12th Class"
					keyboardType={KeyboardType.Default} autoCapitalize={CapitalizeType.Words} refs={formRefs}
					nextCtl="twelfth_year" />

				<MyTextInput name="twelfth_year" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['twelfth_year']} showLabel={true} label="Year of 12th Class"
					keyboardType={KeyboardType.Number} refs={formRefs} maxLength={4}
					nextCtl="bachelors_degree"  iconType={ExpoIconType.MaterialIcons} iconName="calendar-today" iconStyle={{...GS.pt20}} />
			</CardView>
			<CardView>

				<MyTextInput name="bachelors_degree" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['bachelors_degree']} showLabel={true} label="Name of Bachelors Degree"
					keyboardType={KeyboardType.Default} autoCapitalize={CapitalizeType.Words} refs={formRefs}
					nextCtl="bachelors_year" />

				<MyTextInput name="bachelors_year" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['bachelors_year']} showLabel={true} label="Year of Bachelors Degree"
					keyboardType={KeyboardType.Number} refs={formRefs} maxLength={4}
					nextCtl="masters_degree"  iconType={ExpoIconType.MaterialIcons} iconName="calendar-today" iconStyle={{...GS.pt20}} />
			</CardView>
			<CardView>
				<MyTextInput name="masters_degree" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['masters_degree']} showLabel={true} label="Name of Masters Degree"
					keyboardType={KeyboardType.Default} autoCapitalize={CapitalizeType.Words} refs={formRefs}
					nextCtl="masters_year" />

				<MyTextInput name="masters_year" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['masters_year']} showLabel={true} label="Year of Masters Degreee"
					keyboardType={KeyboardType.Number} refs={formRefs} maxLength={4}
					nextCtl="bed_year"  iconType={ExpoIconType.MaterialIcons} iconName="calendar-today" iconStyle={{...GS.pt20}} />
			</CardView>
			<MyTextInput name="bed_year" value={formValues} error={formErrors} submitting={isSubmitting}
				initialValue={formValues['bed_year']} showLabel={true} label="B.Ed Year"
				keyboardType={KeyboardType.Number}  textInputStyle={{...GS.mh15,...GS.mt10}} lebelStyle={{...GS.mh15}} refs={formRefs} maxLength={4}
				nextCtl="net_jrf_year"  iconType={ExpoIconType.MaterialIcons} iconName="calendar-today"  iconStyle={{...GS.pt30 ,...GS.pl15 }} />

			<MyTextInput name="net_jrf_year" value={formValues} error={formErrors} submitting={isSubmitting}
				initialValue={formValues['net_jrf_year']} showLabel={true} label="Year of Net Jrf"
				keyboardType={KeyboardType.Number}  textInputStyle={{...GS.mh15,...GS.mt10}} lebelStyle={{...GS.mh15}} refs={formRefs} maxLength={4}
				nextCtl="others"  iconType={ExpoIconType.MaterialIcons} iconName="calendar-today"  iconStyle={{...GS.pt30 ,...GS.pl15 }} />
			<CardView>
				<MyTextInput name="others" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['others']} showLabel={true} label="Other Qualification Name (if any)"
					keyboardType={KeyboardType.Default} autoCapitalize={CapitalizeType.Words} refs={formRefs}
					nextCtl="others_year" />

				<MyTextInput name="others_year" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['others_year']} showLabel={true} label="Other Qualification Year (if any)"
					keyboardType={KeyboardType.Number} refs={formRefs} maxLength={4}  iconType={ExpoIconType.MaterialIcons} iconName="calendar-today" iconStyle={{...GS.pt20}} />
			</CardView>
			<View style={GS.formFooter}>
				{/* <SubmitButton title="Submit" onPress={saveButtonClickHandler} IsLoading={showButtonLoader} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.mh10, ...GS.f1, ...GS.minw100, ...GS.mb10, ...GS.rounded50 }} /> */}
			</View>

		</MyContainer>
	)
}

const styles = StyleSheet.create({

})

export default EducationDetailScreen;
