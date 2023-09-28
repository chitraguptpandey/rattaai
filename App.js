import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider } from 'react-native-popup-menu';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'expo-status-bar';
import * as Application from 'expo-application';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import { usePreventScreenCapture } from 'expo-screen-capture';

import { Provider } from 'react-redux';

import AppNavigator from './navigation/AppNavigator';
import Colors from './constants/Colors';

import * as GlobalFunctions from './common/GlobalFunctions';

import * as initAction from './store/actions/init';
import * as loginActions from './store/actions/login';
import * as versionAction from './store/actions/version';
import Variables from './constants/Variables';

import store from './ReduxStore';

enableScreens();

export default function App() {

	//usePreventScreenCapture();

	LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
	LogBox.ignoreAllLogs(); //Ignore all log notifications

	const [isReady, setIsReady] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [introFlag, setIntoFlag] = useState(0);

	let localAndroVersion = 0;
	let serverAndroVersion = 0;
	let localIosVersion = 0;
	let serverIosVersion = 0;

	const fetchFonts = async () => {
		return Font.loadAsync({
			'Inter_Regular': require('./assets/fonts/Inter-Regular.ttf'),
			'Inter_SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
			'Inter_Bold': require('./assets/fonts/Inter-Bold.ttf'),
			'Roboto': require('./assets/fonts/Roboto.ttf'),
			'Roboto_medium': require('./assets/fonts/Roboto_medium.ttf'),
			'Roboto_bold': require('./assets/fonts/Roboto_bold.ttf'),
			'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
			'Poppins_medium': require('./assets/fonts/Poppins-SemiBold.ttf'),
			'Poppins_bold': require('./assets/fonts/Poppins-Bold.ttf')
		});
	};

	const promptForUpdate = () => {
		setTimeout(() => {
			if (Platform.OS === 'android' && localAndroVersion < serverAndroVersion) {
				GlobalFunctions.showAndroidUpdateMessage();
			} /*else if (Platform.OS === 'ios' && localIosVersion < serverIosVersion) {
				GlobalFunctions.showIosUpdateMessage();
			}*/
		}, 1000);
	}

	const tryLogin = async () => {

		try {

			const objVersion = await store.dispatch(versionAction.getVersion());

			localAndroVersion = parseInt(Application.nativeBuildVersion);
			serverAndroVersion = parseInt(objVersion.android);
			localIosVersion = parseInt(parseFloat(1) * 100);
			serverIosVersion = parseInt(parseFloat(1) * 100);

			await store.dispatch(initAction.getDefaultData());

			const introStatus = await AsyncStorage.getItem('introStatus');
			if (introStatus != undefined) {
				setIntoFlag(1);
			}

			const examId = await AsyncStorage.getItem('ExamId');
			const batchId = await AsyncStorage.getItem('BatchId');
			if (examId != undefined && batchId != undefined) {
				Variables.ExamId = parseInt(examId);
				Variables.BatchId = parseInt(batchId);
			} else {
				Variables.ExamId = 0;
				Variables.BatchId = 0;
			}

			const studentData = await AsyncStorage.getItem('studentData');
			if (!studentData) {
				setTimeout(() => {
					setIsReady(true);
					SplashScreen.hideAsync();
					promptForUpdate();
				}, 3000);
			}
			else {
				const objData = JSON.parse(studentData);
				const { email, password } = objData;

				if (email != '' && password != '') {
					let action = loginActions.login(email, password);

					try {
						await store.dispatch(action);
						setIsLoggedIn(true);
						setIsReady(true);
						SplashScreen.hideAsync();
						promptForUpdate();
					} catch (err) {
						//Alert.alert('An Error Occurred!', err.message, [{ text: 'Okay' }]);
						setIsReady(true);
						SplashScreen.hideAsync();
						promptForUpdate();
					}
				}
				else {
					setTimeout(() => {
						setIsReady(true);
						SplashScreen.hideAsync();
						promptForUpdate();
					}, 500);
				}
			}
		} catch (err1) {
			Alert.alert('An Error Occurred!', err1.toString(), [{ text: 'Okay' }]);
		}
	}

	useEffect(() => {
		async function prepare() {
			try {
				await SplashScreen.preventAutoHideAsync();
				await fetchFonts();
				await tryLogin();
			} catch (e) {
				console.log('error in prepare - ' + e);
			}
		}
		prepare();
	}, [isReady]);

	if (!isReady) {
		return null;
	}

	return (
		<Provider store={store}>
			<MenuProvider customStyles={menuProviderStyles}>
				<View style={styles.container}>
					<StatusBar style="light" hidden />
					<AppNavigator initialRouteName={isLoggedIn ? "Dashboard" : (introFlag == 0 ? "Intro" : "Login")} />
				</View>
			</MenuProvider>
		</Provider>
	);
}

//const STATUSBAR_HEIGHT = Constants.statusBarHeight + (Platform.OS === 'ios' ? 5 : 0);

const menuProviderStyles = {
	backdrop: {
		backgroundColor: 'black',
		opacity: 0.5,
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	/*statusBar: {
		height: STATUSBAR_HEIGHT,
	},*/
});


//set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.3