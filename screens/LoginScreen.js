import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as ExpoIconType from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import Toast from 'react-native-tiny-toast';

import Menu, { MenuTrigger, MenuOptions, MenuOption, renderers } from 'react-native-popup-menu';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { Text, Bold } from '../components/Tags';
import MyContainer from '../components/MyContainer';
import MyTextInput from '../components/MyTextInput';
import SubmitButton from '../components/SubmitButton';
import MyDialog from '../components/MyDialog'
import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';

import Colors from '../constants/Colors';
import * as loginActions from '../store/actions/login';
import CardView from '../components/CardView';

const { ContextMenu, SlideInMenu, Popover } = renderers;

const LoginScreen = props => {

	const appSettings = useSelector(state => state.init);

	const [showButtonLoader, setShowButtonLoader] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [menuRef, setMenuRef] = useState();

	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	const dispatch = useDispatch();

	const loginButtonClickHandler = async () => {
		setIsSubmitting(true);
		setTimeout(() => {
			login();
		}, 50);
	};

	const login = async () => {
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
			await dispatch(loginActions.login(formValues['email'], formValues['password']));
			setShowButtonLoader(false);
			setIsSubmitting(false);
			GlobalFunctions.navigate(props, 'Dashboard');
		} catch (err) {
			setShowButtonLoader(false);
			setIsSubmitting(false);
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
	}

	const forgotPasswordClickHandler = () => {
		GlobalFunctions.navigate(props, 'ForgotPassword');
	}

	const copyEmail = async () => {
		await Clipboard.setStringAsync(appSettings.SupportEmail);
		menuRef.close();
		Toast.show('Copied');
	}

	const copyMobile = async () => {
		await Clipboard.setStringAsync(appSettings.SupportMobile);
		menuRef.close();
		Toast.show('Copied');
	}

	const signupClickHandler = () => {
		GlobalFunctions.navigate(props, 'Signup');
	}

	return (

		<MyContainer navigation={props.navigation} showAppHeader={false}>

			<View style={styles.loginSection}>

				<Image source={require('../assets/Img_logo.png')} style={{ ...GS.scenter, ...GS.h200, ...GS.w200, ...GS.mv20 }} />

				<Bold style={{ ...GS.EmailMob, ...GS.scenter, ...GS.mt20 }}>Log in</Bold>

				{/* <Text style={GS.subHeaderLabel}>Please fill in the credentials</Text> */}

				<MyTextInput name="email" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['email']} label="Enter Email" placeholder="Enter Email"
					validationType={ValidationType.EmailRequired} keyboardType={KeyboardType.Email}
					autoCapitalize={CapitalizeType.None} refs={formRefs} nextCtl="password" showLabel={false}
					iconName="email-outline" style={{ ...GS.rounded50 }} textInputStyle={{ ...GS.pl20 }} />

				<MyTextInput name="password" value={formValues} error={formErrors} submitting={isSubmitting}
					initialValue={formValues['password']} label="Enter Password" placeholder="Enter Password"
					validationType={ValidationType.Required} keyboardType={KeyboardType.Default}
					autoCapitalize={CapitalizeType.None} refs={formRefs} textInputStyle={GS.pl20}
					iconName="lock-outline" />



				<SubmitButton title="Log in" onPress={loginButtonClickHandler} IsLoading={showButtonLoader}
					style={{ ...GS.mv20, backgroundColor: '#52C3FF', ...GS.rounded50 }} textStyle={{ ...GS.textWhite }} />
				<View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
					<TouchableWithoutFeedback onPress={forgotPasswordClickHandler}>
						<Bold style={styles.forgotText} >Forgot Password?</Bold>
					</TouchableWithoutFeedback>
				</View>
			</View>


			<CardView >
				<View style={styles.signupText}>
					<View style={{ ...GS.row100, ...GS.jcenter, ...GS.mb5 }}>
						<Text style={{ ...GS.mr5, ...styles.accountText1 }}>Don't have an account?</Text>
						<TouchableWithoutFeedback onPress={signupClickHandler}>
							<Text style={{ ...GS.textPrimaryDark, ...GS.fs17 }}>Signup</Text>
						</TouchableWithoutFeedback>
					</View>

					<Menu
						ref={r => setMenuRef(r)}
						renderer={SlideInMenu}
						rendererProps={{ anchorStyle: styles.anchorStyle }}
					>
						<MenuTrigger>
							<Text style={styles.accountText2}>Contact Administrator</Text>
						</MenuTrigger>
						<MenuOptions customStyles={optionsStyles} >
							<MenuOption onSelect={() => { return false; }}>
								<View style={{ ...GS.ph30, ...GS.pv15 }}>
									<Bold style={{ ...GS.headerLabel, ...GS.fs24, ...GS.tcenter, ...GS.mv15 }}>Contact us at</Bold>
									<Bold style={{ ...GS.EmailMob, ...GS.fs20 }}>Email</Bold>
									<View style={{ ...GS.row100, ...GS.jspaceb, ...GS.pt5, ...GS.mb10 }}>
										<TouchableWithoutFeedback onPress={() => GlobalFunctions.sendEmail(appSettings.SupportEmail)}>
											<Text style={{ ...GS.textBlack, ...GS.fs18 }}>{appSettings.SupportEmail}</Text>
										</TouchableWithoutFeedback>
										<TouchableOpacity onPress={copyEmail}>
											<View style={GS.ph5}>
												<ExpoIconType.Fontisto name="copy" color={Colors.darkGray} size={20} />
											</View>
										</TouchableOpacity>
									</View>
									<Bold style={{ ...GS.EmailMob, ...GS.fs20, ...GS.mt20 }}>Mobile</Bold>
									<View style={{ ...GS.row100, ...GS.jspaceb, ...GS.pt5, ...GS.mb30 }}>
										<TouchableWithoutFeedback onPress={() => GlobalFunctions.dialPhone(appSettings.SupportMobile)}>
											<Text style={{ ...GS.textBlack, ...GS.fs18 }}>{appSettings.SupportMobile}</Text>
										</TouchableWithoutFeedback>
										<TouchableOpacity onPress={copyMobile}>
											<View style={GS.ph5}>
												<ExpoIconType.Fontisto name="copy" color={Colors.darkGray} size={20} />
											</View>
										</TouchableOpacity>
									</View>
								</View>
							</MenuOption>
						</MenuOptions>
					</Menu>
				</View>
			</CardView>
		</MyContainer>
	);
}

const optionsStyles = {
	optionsContainer: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.white
	},
	logo: {
		width: 80,
		height: 80,
		marginTop: 50,
	},
	loginSection: {
		flex: 1,
		marginTop: 20,
		paddingHorizontal: 15,
	},
	forgotText: {
		paddingVertical: 5,
		paddingLeft: 10,
		textAlign: 'right',
		color: Colors.headingColor
	},
	signupText: {
		paddingVertical: 20,
		justifyContent: 'center',
		alignItems: 'center',
		padding:20
	},
	accountText1: {
		fontSize: 17,
		
	},
	accountText2: {
		fontSize: 17,
		color: Colors.primaryDark,
		paddingVertical: 5,
		
	}
})


export default LoginScreen;
