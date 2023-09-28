import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useDispatch } from 'react-redux';

import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '../components/Tags';
import MyContainer from '../components/MyContainer';
import CardView from '../components/CardView';
import Colors from '../constants/Colors';

import MyProfileImagePicker from '../components/MyProfileImagePicker';

import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';
import MyDialog from '../components/MyDialog';

import * as profileActions from '../store/actions/profile';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen = props => {

	const [isLoading, setIsLoading] = useState(true);

	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	const [profileData, setProfileData] = useState();
	const [picFlag, setPicFlag] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				const userData = await dispatch(profileActions.getProfile());
				setProfileData(userData.profile);
				formValues['id'] = userData.profile.id;
				formValues['profile_pic'] = userData.profile.profile_pic == '' ? '' : GlobalFunctions.getProfileImageUri(userData.profile.profile_pic);
				setIsLoading(false);
			} catch (err) {
				//setIsLoading(false);
				GlobalFunctions.showMessage('An Error Occurred!', err.message);
			}
		}
		getData();
	}, [dispatch, props]);

	const editIconClickHandler = iconNo => {
		if (iconNo == 1) {
			props.navigation.navigate('PersonalDetails');
		} else if (iconNo == 2) {
			props.navigation.navigate('EducationDetails');
		} else if (iconNo == 3) {
			props.navigation.navigate('ContactDetails');
		} else if (iconNo == 4) {
			props.navigation.navigate('AccountDetails');
		} else if (iconNo == 5) {
			props.navigation.navigate('ChangePassword');
		}
	}


	if (isLoading) {
		return (
			<MyContainer navigation={props.navigation} title="Profile" padder={false} >
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primaryDark} />
				</View>
			</MyContainer>
		);
	}

	const updateProfilePic = async () => {
		setIsLoading(true);
		try {
			const apiData = await dispatch(profileActions.updateProfile(formValues));
			formValues['profile_pic'] = GlobalFunctions.getProfileImageUri(apiData.profile_pic);
			setPicFlag(!picFlag);
			GlobalFunctions.showMessage('Details Updated', 'Profile Pic Updated Successfully', hideLoader);
		} catch (err) {
			hideLoader();
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
	}

	const hideLoader = () => {
		setTimeout(() => {
			setIsLoading(false);
		}, 100);
	}

	return (
		<MyContainer navigation={props.navigation} title="Profile" padder={false} >

			<View style={styles.picture}>
				<MyProfileImagePicker name="profile_pic" value={formValues} userImageStyle={{...GS.borderWhite}} initialValue={formValues['profile_pic']}
					onImageSelected={updateProfilePic} />
			</View>

			<View style={{ paddingHorizontal: 5, marginTop: -30, paddingBottom: 15 }}>
				<CardView>
					<TouchableOpacity style={{ ...styles.editIcon }} onPress={() => editIconClickHandler(1)}>

						<MaterialIcons name="edit" size={22} color="white" style={styles.icon} />

					</TouchableOpacity>
					<Text style={{ ...styles.edittext }} onPress={() => editIconClickHandler(1)}  >Edit</Text>
					<View style={{ width: '100%', padding: 10 }}>
						<Text numberOfLines={1} style={styles.studentName}>Personal Details</Text>

						<Text style={styles.info}>Name:  <Text style={{ ...GS.textDarkGray }}> {profileData.name} </Text></Text>
						<Text style={styles.info}>Father Name: <Text style={{ ...GS.textDarkGray }}> {profileData.father_name} </Text> </Text>
						<Text style={styles.info}>Date of Birth: <Text style={{ ...GS.textDarkGray }}> {profileData.dob} </Text> </Text>
						<Text style={styles.info}>Category: <Text style={{ ...GS.textDarkGray }}> {profileData.caste_name} </Text> </Text>
						<Text style={styles.info}>Gender: <Text style={{ ...GS.textDarkGray }}> {profileData.gender_name} </Text>  </Text>
					</View>
				</CardView>

				<CardView>
					<TouchableOpacity style={{ ...styles.editIcon }} onPress={() => editIconClickHandler(3)}>

						<MaterialIcons name="edit" size={22} color="white" style={styles.icon} />

					</TouchableOpacity>
					<Text style={{ ...styles.edittext }} onPress={() => editIconClickHandler(3)}  >Edit</Text>
					<View style={{ width: '100%', padding: 10 }}>
						<Text numberOfLines={1} style={styles.studentName}>Contact Details</Text>

						<Text style={styles.info}>Email:  <Text style={{ ...GS.textDarkGray }}>  {profileData.email} </Text> </Text>
						<Text style={styles.info}>Mobile:  <Text style={{ ...GS.textDarkGray }}>{profileData.mobile} </Text> </Text>
						<Text style={styles.info}>Alternate Mobile:  <Text style={{ ...GS.textDarkGray }}> {profileData.alternate_mobile} </Text> </Text>
						<Text style={styles.info}>Father Mobile:  <Text style={{ ...GS.textDarkGray }}>  {profileData.father_mobile} </Text> </Text>
						<Text style={styles.info}>State:  <Text style={{ ...GS.textDarkGray }}> {profileData.state_name} </Text> </Text>
						<Text style={styles.info}>City:  <Text style={{ ...GS.textDarkGray }}> {profileData.city} </Text> </Text>
						<Text style={styles.info} numberOfLines={1}>Address:  <Text style={{ ...GS.textDarkGray }}> {profileData.address} </Text> </Text>
						<Text style={styles.info}>Postal Code:  <Text style={{ ...GS.textDarkGray }}> {profileData.name} </Text> {profileData.postal_code}</Text>
						<Text style={styles.info}>Aadhar Number:  <Text style={{ ...GS.textDarkGray }}>  {profileData.aadhar_number} </Text></Text>
					</View>
				</CardView>

				<CardView>


					<TouchableOpacity style={{ ...styles.editIcon }} onPress={() => editIconClickHandler(2)}>

						<MaterialIcons name="edit" size={22} color="white" style={styles.icon} />

					</TouchableOpacity>
					<Text style={{ ...styles.edittext }} onPress={() => editIconClickHandler(2)}  >Edit</Text>

					<View style={{ width: '100%', padding: 10 }}>
						<Text numberOfLines={1} style={styles.studentName}>Education Details</Text>

						<Text style={styles.eduinfo}>10th Year: {'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" /> {profileData.tenth_year} {'\n'}</Text> </Text>
						<Text style={styles.eduinfo}>12th Subjects: {'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" />  {profileData.twelfth_subject}</Text></Text>
						<Text style={styles.eduinfo}>12th Year: {'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" />  {profileData.twelfth_year} {'\n'}</Text></Text>
						<Text style={styles.eduinfo}>Bachelors Degree: {'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" />  {profileData.bachelors_degree}</Text></Text>
						<Text style={styles.eduinfo}>Bachelors Degree Year:{'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" />  {profileData.bachelors_year}{'\n'}</Text></Text>
						<Text style={styles.eduinfo}>Masters Degree: {'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" />  {profileData.masters_degree}</Text></Text>
						<Text style={styles.eduinfo}>Masters Degree Year:{'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" />  {profileData.masters_year}{'\n'}</Text></Text>
						<Text style={styles.eduinfo}>B.Ed Year: {'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" />  {profileData.bed_year}</Text>{'\n'}</Text>
						<Text style={styles.eduinfo}>Year of Net Jrf:{'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" />  {profileData.net_jrf_year}{'\n'}</Text></Text>
						<Text style={styles.eduinfo}>Other Qualification:{'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" />  {profileData.others}</Text></Text>
						<Text style={styles.eduinfo}>Other Qualification Year:{'\n'}<Text style={{ ...GS.textDarkGray }}><MaterialCommunityIcons name="calendar-month" size={22} color="gray" />  {profileData.others_year}{'\n'}</Text></Text>
					</View>
				</CardView>

				<CardView>
					<TouchableOpacity style={{ ...styles.editIcon }} onPress={() => editIconClickHandler(5)}>

						<MaterialIcons name="edit" size={22} color="white" style={styles.icon} />

					</TouchableOpacity>
					<Text style={{ ...styles.edittext }} onPress={() => editIconClickHandler(5)} >Edit</Text>
					<View style={{ width: '100%', padding: 10 }}>
						<Text numberOfLines={1} style={styles.studentName}>Security Details</Text>

						<Text style={styles.info}>Password:  **********</Text>
					</View>
				</CardView>

			</View>

		</MyContainer>
	)
}

const styles = StyleSheet.create({
	picture: {
		width: '100%',
		height: 200,
		paddingTop: 10,
		
		backgroundColor: Colors.white
	},
	editIcon: {
		width: 35,
		height: 35,
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		left: '75%',
		top: 12,
		zIndex: 1,
		backgroundColor: Colors.successLight
	},
	edittext:
	{
		fontSize: 18,
		position: 'absolute',
		left: '90%',
		top: 16,
		zIndex: 1,
		color: Colors.successLight

	},
	studentName: {
		fontSize: 23,
		paddingRight: 35,
		marginBottom: 5
	},
	info: {
		marginVertical: 5,
		//fontSize: 16
	},
	eduinfo: {
		marginVertical: 5,
		color: Colors.headingColor,
		fontSize: 18

		//fontSize: 16
	}
})

export default ProfileScreen;
