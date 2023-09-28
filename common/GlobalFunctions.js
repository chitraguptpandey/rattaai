import { Alert, Linking, Platform } from 'react-native';

import Toast from 'react-native-tiny-toast';
import * as Application from 'expo-application';

import * as RootNavigation from '../navigation/RootNavigation';
import * as loginActions from '../store/actions/login';
import Variables from '../constants/Variables';
import Colors from '../constants/Colors';
import store from '../ReduxStore';

export const dialPhone = number => {
	let phoneNumber = '';

	if (Platform.OS === 'android') {
		phoneNumber = 'tel:${' + number + '}';
	}
	else {
		phoneNumber = 'telprompt:${' + number + '}';
	}
	Linking.openURL(phoneNumber);
}

export const sendEmail = email => {
	Linking.openURL('mailto:' + email);
}

export const getProfileImageUri = (image_name) => {
	const baseUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;
	const imageUri = baseUrl + Variables.ProfileImageUrl + image_name;
	return imageUri;
}

export const getIntroImageUri = (image_name) => {
	const baseUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;
	const imageUri = baseUrl + Variables.IntroImageUrl + image_name;
	return imageUri;
}

export const getPaymentGatewayUri = (query_params) => {
	const baseUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;
	const gatewayUri = baseUrl + 'Checkout?' + query_params;
	//const gatewayUri = baseUrl + 'Checkout/failed';
	return gatewayUri;
}

export const getFileType = fileName => {
	const mimes = [
		{ 'extn': 'gif', 'mime': 'image/gif' },
		{ 'extn': 'jpg', 'mime': 'image/jpeg' },
		{ 'extn': 'jpeg', 'mime': 'image/jpeg' },
		{ 'extn': 'png', 'mime': 'image/png' },
		{ 'extn': 'doc', 'mime': 'application/msword' },
		{ 'extn': 'docx', 'mime': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
		{ 'extn': 'xls', 'mime': 'application/excel' },
		{ 'extn': 'xlsx', 'mime': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
		{ 'extn': 'ppt', 'mime': 'application/vnd.ms-powerpoint' },
		{ 'extn': 'pptx', 'mime': 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
		{ 'extn': 'pps', 'mime': 'application/vnd.ms-powerpoint' },
		{ 'extn': 'ppsx', 'mime': 'application/vnd.openxmlformats-officedocument.presentationml.slideshow' },
		{ 'extn': 'pdf', 'mime': 'application/pdf' },
		{ 'extn': 'txt', 'mime': 'text/plain' },
		{ 'extn': 'zip', 'mime': 'application/zip' },
		{ 'extn': 'rar', 'mime': 'application/vnd.rar' }
	];

	const fileExtn = fileName.split('.').pop();
	const result = mimes.filter(x => x.extn == fileExtn);

	if (result.length > 0) {
		return result[0];
	} else {
		showMessage('Invalid File', 'Allowed files types are: \n\njpg, jpeg, png, gif, doc, docx, xls, xlsx, ppt, pptx, pps, ppsx, pdf, txt, zip, rar\n');
		return {};
	}

}

export const showMessage = (title, message, callbackFunction = undefined) => {
	if (Platform.OS === 'ios') {
		message = '\n' + message;
	}
	console.log(message);
	Alert.alert(title, message,
		[
			{
				text: 'OK', onPress: () => {
					if (message.indexOf('Token Expired', 0) > -1) {
						logoutOnTokenExpiration();
					}
					else if (callbackFunction != undefined) {
						callbackFunction();
					}
				}
			},
		],
		{
			cancelable: false
		}
	);
}

export const logoutOnTokenExpiration = async() => {	
	await store.dispatch(loginActions.clearLoginState());
	RootNavigation.navigate('Login', '');
}

export const showConfirmation = (title, message, yesCallbackFunction, yesParam, noCallbackFunction = undefined, noParam = undefined) => {
	if (Platform.OS === 'ios') {
		message = '\n' + message;
	}
	Alert.alert(title, message,
		[
			{ text: 'No', onPress: () => { if (noCallbackFunction != undefined) { noCallbackFunction(noParam); } } },
			{ text: 'Yes', onPress: () => { yesCallbackFunction(yesParam); } },
		],
		{
			cancelable: noCallbackFunction != undefined
		}
	);
}

export const showInstaRConfirmation = (props, testId, testName, totalMarks, langId, redirect,teststopbacknavigate) => {
	Alert.alert('इंस्टा-आर टेस्ट शुरू करें?', 'क्या आपने इस "' + testName + '" के गलत सवाल या छोडे हुये सवाल और उनके जवाब पढ़ लिए हैं?',
		[
			{
				text: 'हाँ', onPress: () => {
					navigate(props, 'StartTest', { testId: testId, langId: langId, testName: testName, instaR: 1,teststopbacknavigate });
				}
			},
			{
				text: 'नहीं', onPress: () => {
					if (redirect) {
						navigate(props, 'ResultView', { testId: testId, langId: langId, testName: testName, totalMarks: totalMarks });
					}
				}
			},
		],
		{
			cancelable: false
		}
	);
}

export const showDeleteConfirmation = (callbackFunction, id) => {
	showConfirmation('Deleting Record ?', 'Are you sure you want to delete this record ?', callbackFunction, id);
}

export const navigate = (props, routeName, navParams = undefined) => {
	if (navParams == undefined) {
		navParams = { tokenValue: 'refresh' };
	}
	props.navigation.reset({ index: 0, routes: [{ name: routeName, params: navParams }] });

	/*console.log(routeName);

	props.navigation.dispatch(
		CommonActions.reset({
			index: 1,
			routes: [
				{ name: 'Dashboard' },
				{
					name: routeName,
					params: navParams,
				},
			],
		})
	);*/
}

export const isEmpty = input => {
	if (input.trim() == '') {
		return true;
	}
	return false;
}

export const isEmptyOrZero = input => {
	if (input.trim() == '') {
		return true;
	}

	if (parseInt(input) == 0) {
		return true;
	}

	return false;
}

export const removeFromArray = (arr, val) => {
	return arr.filter(function (v) {
		return v != val;
	});
}

export const openLiveFile = (source_folder_name, source_file_name) => {
	const baseUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;
	const liveFileUri = baseUrl + source_folder_name + '/' + source_file_name;
	Linking.canOpenURL(liveFileUri).then(supported => {
		if (supported) {
			Linking.openURL(liveFileUri);
		}
		else {
			Toast.show('Unable to open file, may be the file was removed', {
				position: Toast.position.BOTTOM,
				duration: 800,
				containerStyle: {
					backgroundColor: Colors.danger,
					paddingHorizontal: 25
				}
			});
		}
	});
}

export const showErrorToast = (callbackFunction, errorText = Variables.ValidationErrorText) => {
	Toast.show(errorText, {
		position: Toast.position.BOTTOM,
		duration: 800,
		containerStyle: {
			backgroundColor: Colors.danger,
			paddingHorizontal: 25
		},
		onHidden: () => {
			if (callbackFunction != undefined) {
				callbackFunction();
			}
		}
	});
}

export const showToast = (message, callbackFunction) => {
	Toast.show(message, {
		position: Toast.position.BOTTOM,
		duration: 800,
		containerStyle: {
			backgroundColor: Colors.success,
			paddingHorizontal: 25
		},
		onHidden: () => {
			if (callbackFunction != undefined) {
				callbackFunction();
			}
		}
	});
}

export const showAndroidUpdateMessage = callbackFunction => {
	Alert.alert(
		'New Version Available',
		'Please update your app from Play Store to get the new version of this app',
		[
			{ text: 'Okay', onPress: () => { openExternalUri('https://play.google.com/store/apps/details?id=' + Constants.manifest.android.package + '&v=' + Application.nativeBuildVersion, 'Play Store'); } },
		],
		{
			cancelable: false
		}
	);
}

export const showIosUpdateMessage = callbackFunction => {
	Alert.alert(
		'New Version Available',
		'Please update your app from App Store to get the new version of this app',
		[
			{ text: 'Okay', onPress: () => { openExternalUri('https://apps.apple.com/app/id1599833626?v=' + Constants.manifest.ios.buildNumber, 'App Store'); } },
		],
		{
			cancelable: false
		}
	);
}

export const openExternalUri = externalUri => {
	Linking.canOpenURL(externalUri).then(supported => {
		if (supported) {
			Linking.openURL(externalUri);
		}
		else {
			Toast.show('Unable to open the given url, may be url no longer exists', {
				position: Toast.position.BOTTOM,
				duration: 800,
				containerStyle: {
					backgroundColor: Colors.danger,
					paddingHorizontal: 25
				}
			});
		}
	});
}

export const getParamValue = (props, paramName, defaultValue) => {
	const { params } = props.navigation.state;

	if (params && params[paramName]) {
		console.log('direct param');
		return params[paramName];
	}
	else if (props.navigation.dangerouslyGetParent().getParam(paramName)) {
		console.log('dangerous param');
		return props.navigation.dangerouslyGetParent().getParam(paramName);
	} else {
		return defaultValue;
	}
}