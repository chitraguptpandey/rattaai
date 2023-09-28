

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { WebView } from 'react-native-webview'

import MyContainer from '../components/MyContainer';
import MyTextInput from '../components/MyTextInput';
import MyCheckBox from '../components/MyCheckBox';
import SubmitButton from '../components/SubmitButton';
import CardView from '../components/CardView';

import { Text, Bold } from '../components/Tags';
import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

import Colors from '../constants/Colors';
import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';

import * as registrationAction from '../store/actions/registration';
import Variables from '../constants/Variables';

const PurchaseHistoryScreen = props => {

	const loginStateData = useSelector(state => state.login);

	const [isLoading, setIsLoading] = useState(true);
	const [showButtonLoader, setShowButtonLoader] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [paymentHistory, setPaymentHistory] = useState([]);


	console.log(loginStateData.StudentId)
	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});
	const dispatch = useDispatch();

	const webViewRef = useRef();

	useEffect(() => {
		const getExams = async () => {
			try {
				const apiData = await dispatch(registrationAction.getPaymentHistory());
				setPaymentHistory(apiData);
				console.log(apiData)
				setIsLoading(false);
			} catch (err) {
				//console.log(err);
				GlobalFunctions.showMessage('Error Occurred', err.message);
			}
		}
		getExams();
	}, [props, dispatch]);


	const backToDashboard = () => {
		GlobalFunctions.navigate(props, 'Dashboard');
	}



	if (isLoading) {
		return (
			<MyContainer navigation={props.navigation} title="Purchase History">
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primaryDark} />
				</View>
			</MyContainer>
		);
	}

	if (paymentHistory.length == 0) {
		return (
			<MyContainer navigation={props.navigation} title="Purchase History">
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Image source={require('../assets/no_record_found.png')} />
				</View>
			</MyContainer>
		);
	}

	return (
		<MyContainer navigation={props.navigation} title="Purchase History">
			{paymentHistory.map((item, index) => (
				<CardView key={index} style={{ ...GS.mh5, ...GS.mv2, ...GS.mb10, ...GS.rounded10 }}>

					<View style={{ ...GS.row100, ...GS.f1, ...GS.jcenter, ...GS.pr5 }}>




						<View style={{ ...GS.f1 }} >
							<Text><Bold>Exam Name:</Bold> {item.name}</Text>
							<Text><Bold>Payment Date:</Bold> {item.payment_date}</Text>
							<Text><Bold>Payment Mode:</Bold> {item.pay_mode}</Text>
						</View>

						<View style={{ ...GS.f1 }} >
							<Text><Bold>Order Id:</Bold> {item.order_id}</Text>
							<Text><Bold>Amount:</Bold> {item.amount}/-</Text>
						</View>
					</View>


				</CardView>))}

		</MyContainer>
	)

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
		color: Colors.red
	},
	loginText: {
		paddingVertical: 3,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	accountText1: {
		fontSize: 17,
		color: Colors.darkGray,
		marginRight: 5
	},
	accountText2: {
		fontSize: 15,
		color: Colors.primaryDark,
		paddingVertical: 5
	}
});

export default PurchaseHistoryScreen;