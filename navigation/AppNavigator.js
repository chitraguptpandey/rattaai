import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { navigationRef } from './RootNavigation';
import { Ionicons } from '@expo/vector-icons';

import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PersonalDetailScreen from '../screens/PersonalDetailScreen';
import EducationDetailScreen from '../screens/EducationDetailScreen';
import AccountDetailScreen from '../screens/AccountDetailScreen';
import ContactDetailsScreen from '../screens/ContactDetailsScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import NotificationScreen from '../screens/NotificationScreen';
import MegaTestScreen from '../screens/MegaTestScreen';
import TestResultScreen from '../screens/MegaTestResultScreen';
import TestInstructionScreen from '../screens/TestInstructionScreen';
import ResultViewScreen from '../screens/ResultViewScreen';
import StartTestScreen from '../screens/StartTestScreen';
import OpenTestScreen from '../screens/OpenTestScreen';
import SpecialOpenTestScreen from '../screens/SpecialOpenTestScreen';
import PersonalTestScreen from '../screens/PersonalTestScreen';
import PersonalResultScreen from '../screens/PersonalResultScreen';
import WeekTestScreen from '../screens/WeekTestScreen';
import WeekResultScreen from '../screens/WeekResultScreen';
import StartOpenTestScreen from '../screens/StartOpenTestScreen';
import BuyExamsScreen from '../screens/BuyExamsScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

import DrawerContent from './DrawerContent';
import Variables from '../constants/Variables';
import PurchaseHistoryScreen from '../screens/PurchaseHistoryScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SeparatorScreen from '../screens/SeparatorScreen';
import RemedialTest from '../screens/RemedialTest';
import MegaTestResultScreen from '../screens/MegaTestResultScreen';
import RemedialTestResult from '../screens/RemedialTestResult';
import RemedialTestInstructionScreen from '../screens/RemedialTestInstructionScreen';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AppNavigator = props => {

	const getDrawerOptions = ({ route }) => {
		const routeName = getFocusedRouteNameFromRoute(route) ?? '';
		if (Variables.SwipeDisabledRoutes.includes(routeName)) {
			return ({ swipeEnabled: false, headerShown: false });
		} else {
			return ({ headerShown: false });
		}
	}




	const ProfileStack = () => {
		return (
			<Stack.Navigator initialRouteName={props.initialRouteName}>
				<Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
				<Stack.Screen name="PersonalDetails" component={PersonalDetailScreen} options={{ headerShown: false }} />
				<Stack.Screen name="EducationDetails" component={EducationDetailScreen} options={{ headerShown: false }} />
				<Stack.Screen name="ContactDetails" component={ContactDetailsScreen} options={{ headerShown: false }} />
				<Stack.Screen name="AccountDetails" component={AccountDetailScreen} options={{ headerShown: false }} />
				<Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
			</Stack.Navigator>
		);
	}

	const MyDrawerNavigator = () => {
		return (
			<Drawer.Navigator initialRouteName="Dashboard" drawerContent={(props) => <DrawerContent {...props} />}   >
				<Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
				
				<Drawer.Screen name="Profile" component={ProfileStack} options={getDrawerOptions} />
		{/* <Drawer.Screen name="Notifications" component={NotificationScreen} /> */}
				<Drawer.Screen name="MegaTest" component={MegaTestScreen} options={{ headerShown: false }} />
				<Drawer.Screen name="MegaTestResult" component={MegaTestResultScreen} options={{ headerShown: false }} />
				<Drawer.Screen name="RemedialTest" component={RemedialTest} options={{ headerShown: false }} />
				<Drawer.Screen name="RemedialTestResult" component={RemedialTestResult} options={{ headerShown: false }} />
				<Drawer.Screen name="ResultView" component={ResultViewScreen} options={{ headerShown: false, swipeEnabled: false }} />
				<Drawer.Screen name="TestInstruction" component={TestInstructionScreen} options={{ headerShown: false }} />
				<Drawer.Screen name="RemedialTestInstruction" component={RemedialTestInstructionScreen} options={{ headerShown: false }} />

				<Drawer.Screen name="StartTest" component={StartTestScreen} options={{ headerShown: false, swipeEnabled: false }} />
				<Drawer.Screen name="OpenTest" component={OpenTestScreen} options={{ headerShown: false }} />
				<Drawer.Screen name="SpecialOpenTest" component={SpecialOpenTestScreen} options={{ headerShown: false }} />
				<Drawer.Screen name="PersonalTest" component={PersonalTestScreen} options={{ headerShown: false }} />
				<Drawer.Screen name="PersonalResult" component={PersonalResultScreen} options={{ headerShown: false }} />
				<Drawer.Screen name="WeekTest" component={WeekTestScreen} options={{ headerShown: false }} />
				<Drawer.Screen name="WeekResult" component={WeekResultScreen} options={{ headerShown: false }} />
				<Drawer.Screen name="StartOpenTest" component={StartOpenTestScreen} options={{ headerShown: false, swipeEnabled: false }} />
				<Drawer.Screen name="BuyExams" component={BuyExamsScreen} options={{ headerShown: false }} />
				<Drawer.Screen name="Purchasehistory" component={PurchaseHistoryScreen} options={{ headerShown: false }} />

			</Drawer.Navigator>
		);
	}

	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator initialRouteName={props.initialRouteName}>
				<Stack.Screen name="Intro" component={IntroScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Dashboard" component={MyDrawerNavigator} options={{ headerShown: false }} />
				<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	)

}

export default AppNavigator;