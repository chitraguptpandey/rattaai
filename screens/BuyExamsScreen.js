import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
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

const BuyExamsScreen = props => {

	const loginStateData = useSelector(state => state.login);

	const [isLoading, setIsLoading] = useState(true);
	const [showButtonLoader, setShowButtonLoader] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [regStep, setRegStep] = useState(3);
	const [exams, setExams] = useState([]);
	const [selectedExams, setSelectedExams] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [queryParams, setQueryParams] = useState('');


	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	const stepTitles = ["Enter email to validate", "Enter personal information", "Select exam(s) to enroll in", "Proceed with the payment"];

	const dispatch = useDispatch();

	const webViewRef = useRef();

	useEffect(() => {
		const getExams = async () => {
			try {
				const apiData = await dispatch(registrationAction.getExams(loginStateData.StudentId));
				setExams(apiData.exams);
				setIsLoading(false);
			} catch (err) {
				//console.log(err);
				GlobalFunctions.showMessage('Error Occurred', err.message);
			}
		}
		getExams();
	}, [props, dispatch]);

	const paymentClickHandler = () => {
		if (selectedExams.length == 0) {
			return;
		} else {
			GlobalFunctions.showConfirmation('Pay Now?', 'You will be redirected to the Payment Gateway, ' +
				'where you can pay using all available modes of payment. Proceed?', redirectForPayment);
		}
	}

	const redirectForPayment = () => {
		const qParams = 'exam_ids=' + selectedExams.join(',') + '&student_id=' + loginStateData.StudentId;
		setQueryParams(qParams);
		setRegStep(4);
	}

	const examSelectDeselect = (id, status) => {
		if (selectedExams.includes(id)) {
			const index = selectedExams.indexOf(id);
			if (index > -1) {
				selectedExams.splice(index, 1);
			}
		} else {
			selectedExams.push(id);
		}

		const filtered = exams.filter(x => selectedExams.includes(x.exam_id));
		const amt = filtered.reduce((a, b) => parseInt(a) + parseInt(b.buy_price), 0);
		setTotalAmount(amt);
	}

	const renderExams = () => {
		let arrItems = [];

		exams.map((item, index) => {
			arrItems.push(<CardView key={"exm" + index} style={{ ...GS.mh5, ...GS.mv2, ...GS.mb10, ...GS.rounded10 }}>
				<View style={{ ...GS.row100, ...GS.minh45 }}>
					<View style={{ ...GS.f1, ...GS.jcenter, ...GS.pr5 }}>
						<MyCheckBox title={item.exam_name} onCheckChanged={(status) => examSelectDeselect(item.exam_id, status)}
							isChecked={selectedExams.includes(item.exam_id)} />
					</View>
					<View style={{ ...GS.w60, ...GS.acenter, ...GS.jcenter, ...GS.bgPrimary, ...GS.rounded10 }}>
						<Text>{item.buy_price}/-</Text>
					</View>
				</View>
			</CardView>)
		});

		if (exams.length == 0) {
			arrItems.push(
				<Bold key="noexam" style={{ ...GS.w100p, ...GS.tcenter, ...GS.textDanger, ...GS.mt20, ...GS.fs18 }}>
					No Exams Found
				</Bold>
			);
		}

		return arrItems;
	}

	const handlePaymentResponse = (msg) => {
		setRegStep(5);
		if (msg.nativeEvent.data == 'payment_cancelled') {
			setRegStep(3);
		}
		else if (msg.nativeEvent.data == 'payment_success') {
			GlobalFunctions.navigate(props, 'Dashboard');
		} else {
			GlobalFunctions.showConfirmation('Retry?', 'Do you want to retry this payment again, may be using other mode?', retryPayment, 0, backToDashboard);
		}
	}

	const retryPayment = () => {
		setRegStep(4);
	}

	const backToDashboard = () => {
		GlobalFunctions.navigate(props, 'Dashboard');
	}

	if (isLoading) {
		return (
			<MyContainer navigation={props.navigation} title="Buy Exam(s)">
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primaryDark} />
				</View>
			</MyContainer>
		);
	}

	return (
		<MyContainer navigation={props.navigation} title="Buy Exam(s)">
			{
				regStep == 3 &&
				<>
					{renderExams()}

					{
						exams.length > 0 &&
						<SubmitButton title={totalAmount == 0 ? "Make Payment" : "Pay Rs. " + totalAmount + "/-"}
							onPress={paymentClickHandler} IsLoading={showButtonLoader}
							style={{
								marginVertical: 20,
								backgroundColor: (totalAmount == 0 ? Colors.gray : Colors.btnColor),
								borderColor: (totalAmount == 0 ? Colors.gray : Colors.btnBorderColor)
							}}
							textStyle={{
								color: (totalAmount == 0 ? Colors.darkGray : Colors.black)
							}}
						/>
					}
				</>
			}

			{
				regStep == 4 &&
				<WebView
					ref={(ref) => webViewRef.current = ref}
					style={{ backgroundColor: Colors.appBg }}
					source={{ uri: GlobalFunctions.getPaymentGatewayUri(queryParams) }}
					setSupportMultipleWindows={true}
					javaScriptCanOpenWindowsAutomatically={true}
					javaScriptEnabled={true}
					onMessage={handlePaymentResponse}
				/>
			}

			{
				regStep == 5 &&
				<View>
				</View>
			}
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

export default BuyExamsScreen;