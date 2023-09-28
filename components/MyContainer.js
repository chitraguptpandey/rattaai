import React, { useEffect, useState } from 'react';
import { View, Alert, BackHandler, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

import Colors from '../constants/Colors';
import * as GlobalFunctions from '../common/GlobalFunctions';
import Variables from '../constants/Variables';
import AppHeader from '../navigation/AppHeader';
import { useSelector } from 'react-redux';

const STATUSBAR_HEIGHT = Constants.statusBarHeight + (Platform.OS === 'ios' ? 5 : 0);

const MyContainer = props => {

	const route = useRoute();
	const stateData = useSelector(state => state);

	useEffect(() => {
		const backAction = () => {

			if (route.name == 'Dashboard') {
				Alert.alert('Hold on!', 'Are you sure you want to exit ?', [
					{
						text: 'Cancel',
						onPress: () => null,
						style: 'cancel',
					},
					{ text: 'YES', onPress: () => BackHandler.exitApp() },
				]);
				return true;
			} else if (route.name == 'ResultView') {
				GlobalFunctions.navigate(props, 'TestResult');
				return true;
			} else if (route.name == 'TestInstruction') {
				GlobalFunctions.navigate(props, 'MegaTest');
				return true;
			}
			else {
				if (Variables.ProfileStack.includes(route.name)) {
					if (route.name == 'AccountDetail') {
						props.moveToProfile();
						return true;
					} else {
						GlobalFunctions.navigate(props, 'Profile');
						return true;
					}
				} else if (route.name == 'ForgotPassword') {
					props.cancelTimer();
					setTimeout(() => {
						GlobalFunctions.navigate(props, 'Login');
					}, 100);
					return true;
				} else if (route.name == 'StartTest' || route.name == 'StartOpenTest') {
					/*if (props.menuRef != undefined && props.menuRef.isOpen()) {
						props.menuClose();
					} else {
						props.examStopClickHandler();
					}*/
					return true;
				} else if(route.name == 'Signup') {
					GlobalFunctions.navigate(props, 'Login');
					return true;
				}
				else if (route.name != 'Login') {
					GlobalFunctions.navigate(props, 'Dashboard');
					return true;
				}
			}
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);

	const MyStatusBar = () => (
		<View style={styles.statusBar}>
			<StatusBar translucent backgroundColor={Colors.primaryDark} style="light" hidden={false} />
		</View>
	);

	return (
		<>

			<MyStatusBar />
			{/* <StatusBar translucent backgroundColor={Colors.primaryDark} style="light" hidden={false} /> */}

			{
				(props.showAppHeader == undefined || props.showAppHeader === true) &&
				<AppHeader {...props} />
			}
			{
				props.noScroll ?
					<View style={{ flex: 1 }}>
						{props.children}
					</View>
					:
					<ScrollView style={{ ...props.style, padding: props.padder == undefined || props.padder === true ? 10 : 0 }}
						contentContainerStyle={{ flexGrow: 1 }} overScrollMode='never' keyboardShouldPersistTaps="handled"
						stickyHeaderIndices={props.stickyHeaderIndices}>
						{
							props.stickyHeaderIndices ? props.children : <View style={{ flex: 1 }}>{props.children}</View>
						}
					</ScrollView>
			}
		</>
	)
}

const styles = StyleSheet.create({
	statusBar: {
		height: STATUSBAR_HEIGHT,
		backgroundColor: Colors.primaryDark
	}
})

export default MyContainer;
