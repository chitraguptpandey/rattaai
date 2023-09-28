import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { WebView } from 'react-native-webview';

import { paymentMode } from '../store/actions/paymentmode';
import { addStudent } from '../store/actions/addstudent';
import { addStudentCourse } from '../store/actions/addstudent';
import { getExamdetails } from '../store/actions/addstudent';
import { getBatchesList } from '../store/actions/addstudent';

import MyContainer from '../components/MyContainer';
import MyTextInput from '../components/MyTextInput';
import MyCheckBox from '../components/MyCheckBox';
import MyRadioInput from '../components/MyRadioInput';
import MyDateTimePickerDialog from '../components/MyDateTimePickerDialog';
import SubmitButton from '../components/SubmitButton';
import CardView from '../components/CardView';
import MyRadioButton from '../components/MyRadioButton';

import { Text, Bold } from '../components/Tags';
import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

import Colors from '../constants/Colors';
import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';

import * as registrationAction from '../store/actions/registration';
import Variables from '../constants/Variables';

const SignupScreen = props => {

	const [showButtonLoader, setShowButtonLoader] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [regStep, setRegStep] = useState(1);
	const [exams, setExams] = useState([]);
	const [selectedExams, setSelectedExams] = useState([]);
	const [selectedBatches, setSelectedBatches] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [queryParams, setQueryParams] = useState('');

	const [isPayment, setIsPayment] = useState(null);
	const [stepTitles, setStepTitles] = useState([]);
	const [examsList, setExamList] = useState(null);
	const [batchesList, setBatchesList] = useState([]);
	const [batchesListError, setBatchesListError] = useState(null);
	const [studentApiDone, setStudentApiDone] = useState(false);
	const [examsSelected, setExamsSelected] = useState(false);
	const [selectedExam, setSelectedExam] = useState(null);
	const [examId, setExamId] = useState(null);
	const [examBatchDetails, setExamBatchDetails] =useState(null);

    // const [paymentError, setPaymentError] = useState(null);


	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	

	const dispatch = useDispatch();

	const webViewRef = useRef();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await paymentMode()();
				setIsPayment(response.data);
				if(response.data)
				{
					setStepTitles(["Enter email to validate", "Enter personal information", "Select exam(s) to enroll in", "Proceed with the payment"]);
				}
				else
				{
					setStepTitles(["Enter email to validate", "Enter personal information", "Select exam(s) to enroll in","One Step Ahead to Add Course in bag."]);
				}
				
			} catch (err) {
				setPaymentError(err.message);
			}
		};
	
		fetchData();
	}, []);

	

	useEffect(() => {

		const getExams = async () => {
			const apiData = await dispatch(registrationAction.getExams());
			setExams(apiData.exams);
		}
		setTimeout(() => {
			getExams();
		}, 200);
	}, [props, dispatch]);

	useEffect(()=>{
		const examsDetails = async () => {
			try {
				const examresponse = await getExamdetails()();
				setExamList(examresponse.data);
			} catch (error) {
				console.log(error);
			}
		}
		examsDetails();
	}, [studentApiDone]);

	useEffect(()=>{

		const batchesDetails = async () => {
			const examidselect = {"exam_id":examId};

			try {
				const batchresponse = await getBatchesList(examidselect)();
				setBatchesList(batchresponse.data);
			} catch (error) {
				setBatchesListError(error);
			}

		}

		batchesDetails();
		
	},[examsSelected]);

	const loginClickHandler = () => {
		GlobalFunctions.navigate(props, 'Login');
	}

	const validateClickHandler = async () => {
		setIsSubmitting(true);
		setTimeout(() => {
			validateEmail();
		}, 50);
	}

	const validateEmail = async () => {
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
			await dispatch(registrationAction.validateEmail(formValues['email']));
			setIsSubmitting(false);
			setRegStep(2);
			setTimeout(() => {
				if (formRefs['name']) {
					formRefs['name'].focus();
				}
			}, 100);
		} catch (err) {
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
		setShowButtonLoader(false);
	}


	const showExamsClickHandler = async () => {
		setIsSubmitting(true);
	
		if (isPayment) {
			setTimeout(() => {
				showExams();
			}, 50);
		} else {
			const studentData = {
				name: formValues['name'],
				email: formValues['email'],
				mobile: formValues['mobile'],
				password: formValues['password'],
				gender: formValues['gender'],
				dob: formValues['dob'],
				aadhar_number: formValues['aadhar_number'],
				registration_date: '' 
			};

			try {
				const response = await addStudent(studentData);
				if(response)
				{
					// GlobalFunctions.navigate(props, 'Login');
					setIsSubmitting(false);
					setStudentApiDone(true);
					setRegStep(3);
					
				}
				
			} catch (error) {
				Alert.alert('Error', error.message);
				setIsSubmitting(false);
			}
			
		}
	}



	const showExams = async () => {
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

		if (formValidated) {
			setIsSubmitting(false);
			setRegStep(3);
		}
	}

	const paymentClickHandler = () => {
		if(isPayment)
		{
			if (selectedExams.length == 0) {
				return;
			} else {

				if(isPayment)
				{
					GlobalFunctions.showConfirmation('Pay Now?', 'You will be redirected to the Payment Gateway, ' +
					'where you can pay using all available modes of payment. Proceed?', redirectForPayment);
				}
				else
				{

					GlobalFunctions.showConfirmation('Proceed', 'We Proceeding your information.', redirectForPayment)
				}
				
			}
		}
		else
		{
			
			setExamId(selectedExam);
			setExamsSelected(true);
			console.log(selectedExam,'dfsosd');
			GlobalFunctions.showConfirmation('Proceed', 'We Proceeding your information.', redirectForPayment)
		}
	}


	const redirectForPayment = () => {
		const qParams = 'exam_ids=' + selectedExams.join(',') +
			'&name=' + encodeURIComponent(formValues['name']) +
			'&email=' + encodeURIComponent(formValues['email']) +
			'&password=' + encodeURIComponent(formValues['password']) +
			'&mobile=' + formValues['mobile'] +
			'&aadhar_number=' + formValues['aadhar_number'] +
			'&gender=' + formValues['gender'] +
			'&dob=' + formValues['dob'] +
			'&student_id=0';

		if(!isPayment)
		{
			const studentemail = decodeURIComponent(formValues['email'])
			const coursedetails =
			{
				"email": studentemail,
				"exam_id": selectedExam,
			}

			setExamBatchDetails(coursedetails);
		}

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

		if(isPayment)
		{
			exams.map((item, index) => {
				arrItems.push(<CardView key={"exm" + index} style={{ ...GS.mh0, ...GS.mv0, ...GS.mb10, ...GS.rounded10 }}>
					<View style={{ ...GS.row100, ...GS.minh45 }}>
						<View style={{ ...GS.f1, ...GS.jcenter, ...GS.pr5 }}>
							<MyCheckBox title={item.exam_name} onCheckChanged={(status) => examSelectDeselect(item.exam_id, status)}
								isChecked={selectedExams.includes(item.exam_id)} />
						</View>

						{isPayment && <View style={{ ...GS.w60, ...GS.acenter, ...GS.jcenter, ...GS.bgPrimary, ...GS.rounded10 }}>
							<Text>{item.buy_price}/-</Text>
						</View>}
					</View>
				</CardView>)
			});
		}
		else
		{

			examsList.map((item, index) => {
				arrItems.push(
					<CardView key={"exm" + index} style={{ ...GS.mh0, ...GS.mv0, ...GS.mb10, ...GS.rounded10 }}>
						<View style={{ ...GS.row100, ...GS.minh45 }}>
							<View style={{ ...GS.f1, ...GS.jcenter, ...GS.pr5 }}>
								<MyRadioButton 
									title={item.name} 
									onSelectedChanged={(status) => {
										if (status) {
											setSelectedExam(item.id);
										} else {
											setSelectedExam(null);
										}
									}}
									
									isSelected={selectedExam === item.id}
								/>
							</View>
			
							{isPayment && <View style={{ ...GS.w60, ...GS.acenter, ...GS.jcenter, ...GS.bgPrimary, ...GS.rounded10 }}>
								<Text>{item.buy_price}/-</Text>
							</View>}
						</View>
					</CardView>
				);
			});
		}

		if (exams.length == 0) {
			arrItems.push(
				<Bold key="noexam" style={{ ...GS.w100p, ...GS.tcenter, ...GS.textDanger, ...GS.mt20, ...GS.fs18 }}>
					No Exams Found
				</Bold>
			);
		}

		return arrItems;
	}

	const backToStep3 = () =>
	{
		setRegStep(3);
	}

	const renderBatches = () => {
		let batchItems = [];

		if(batchesList && batchesList.length > 0) {
		batchesList.map((item, index) => {
			batchItems.push(
				<CardView key={"exm" + index} style={{ ...GS.mh0, ...GS.mv0, ...GS.mb10, ...GS.rounded10 }}>
					<View style={{ ...GS.row100, ...GS.minh45 }}>
						<View style={{ ...GS.f1, ...GS.jcenter, ...GS.pr5 }}>
							<MyRadioButton 
								title={item.name} 
								onSelectedChanged={(status) => {
									if (status) {
										setSelectedBatches(item.id);
									} else {
										setSelectedBatches(null);
									}
								}}
								
								isSelected={selectedBatches === item.id}
							/>
						</View>
		
						{isPayment && <View style={{ ...GS.w60, ...GS.acenter, ...GS.jcenter, ...GS.bgPrimary, ...GS.rounded10 }}>
							<Text>{item.buy_price}/-</Text>
						</View>}
					</View>
				</CardView>
			);
		});
		}

		if (!batchesList || batchesList.length === 0) {
			batchItems.push(
				<>
				<Bold key="nobatches" style={{ ...GS.w100p, ...GS.tcenter, ...GS.textDanger, ...GS.mt20, ...GS.fs18 }}>
					No Batches Found
				</Bold>
				</>
			);
		}

		return batchItems;

	}


	const handlePaymentResponse = (msg) => {
		setRegStep(5);
		if (msg.nativeEvent.data == 'payment_cancelled') {
			setRegStep(3);
		}
		else if (msg.nativeEvent.data == 'payment_success') {
			GlobalFunctions.navigate(props, 'Login');
		} else {
			if(isPayment)
			{
				GlobalFunctions.showConfirmation('Retry?', 'Do you want to retry this payment again, may be using other mode?', retryPayment, 0, backToLogin);
			}
			else
			{
				
				GlobalFunctions.navigate(props, 'Login');
			}
			
		}
	}

	const examBatchesHandler = async () => {
		examBatchDetails.batch_id = selectedBatches;
	
		try {
			const actionFunction = addStudentCourse(examBatchDetails);
			const response = await actionFunction(); // This is where you invoke the returned function
			if(response)
			{
				GlobalFunctions.navigate(props, 'Login');
			}
		} catch (error) {
			console.log(error);
		}
	
		// GlobalFunctions.showConfirmation('Finish', 'Click "Yes" to start');
	}

	const retryPayment = () => {
		setRegStep(4);
	}

	const backToLogin = () => {
		GlobalFunctions.navigate(props, 'Login');
	}

	return (
		<MyContainer navigation={props.navigation} showAppHeader={false}>
			{
				regStep < 4 &&
				<>
					<View style={styles.loginSection}>
						<Bold style={GS.headerLabel}>Signup</Bold>
						<Text style={GS.subHeaderLabel}>{stepTitles[regStep - 1]}</Text>

						{
							regStep <= 2 &&
							<MyTextInput name="email" value={formValues} error={formErrors} submitting={isSubmitting}
								initialValue={formValues['email']} label="Enter Email" placeholder="Enter Email"
								validationType={ValidationType.EmailRequired} keyboardType={KeyboardType.Email}
								autoCapitalize={CapitalizeType.None} refs={formRefs} returnKeyType="done"
								editable={regStep == 1} />
						}

						{
							regStep == 1 &&
							<View>            					
							<SubmitButton title="Check Availability" onPress={validateClickHandler} IsLoading={showButtonLoader}   textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor,  ...GS.f1, ...GS.mb10,marginVertical: 20 }}  />
							</View>
						}

						{
							regStep == 2 &&
							<>
								<MyTextInput name="name" value={formValues} error={formErrors} submitting={isSubmitting}
									initialValue={formValues['name']} label="Full Name" placeholder="Enter Full Name"
									validationType={ValidationType.Required} keyboardType={KeyboardType.Default}
									autoCapitalize={CapitalizeType.Words} refs={formRefs} nextCtl="mobile" />

								<MyTextInput name="mobile" value={formValues} error={formErrors} submitting={isSubmitting}
									initialValue={formValues['mobile']} label="Mobile Number"
									placeholder="Enter Mobile Number" keyboardType={KeyboardType.Number}
									autoCapitalize={CapitalizeType.Words} refs={formRefs}
									maxLength={10} nextCtl="password" validationType={ValidationType.MobileRequired} />

								<MyTextInput name="password" value={formValues} error={formErrors} submitting={isSubmitting}
									keyboardType={KeyboardType.Default} initialValue={formValues['password']}
									label="Password" placeholder="Enter Password" validationType={ValidationType.Required}
									maxLength={30} refs={formRefs} nextCtl="aadhar_number" autoCapitalize={CapitalizeType.None} />

								<MyTextInput name="aadhar_number" value={formValues} error={formErrors} submitting={isSubmitting}
									initialValue={formValues['aadhar_number']} label="Aadhar Number"
									placeholder="Enter Aadhar Number" keyboardType={KeyboardType.Number} refs={formRefs}
									validationType={ValidationType.NumberRequired} minLength={12} maxLength={12} returnKeyType="done" />

								<MyDateTimePickerDialog mode="date" name="dob" value={formValues} error={formErrors} submitting={isSubmitting}
									initialValue={formValues['dob']} label="Date of Birth" refs={formRefs} returnKeyType="done"
									minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 70))}
									maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 15))}
								 	placeholder="Enter Date of Birth" validationType={ValidationType.Required}	 />

								<MyRadioInput name="gender" value={formValues} error={formErrors} submitting={isSubmitting}
									initialValue={formValues['gender'] == "2" ? "2" : formValues['gender'] == "3" ? "3" : "1"} 
									validationType={ValidationType.Required} refs={formRefs} options={Variables.GenderOptions} label="Gender" />

								<SubmitButton title="Next" onPress={showExamsClickHandler} IsLoading={showButtonLoader} style={{ marginVertical: 20 }} />
							</>
						}

						{
							 regStep == 3 &&
							<>
								{renderExams()}
								{
									exams.length > 0 &&
									<>
									<SubmitButton title={isPayment ? (totalAmount == 0 ? "Make Payment" : "Pay Rs. " + totalAmount + "/-"):'Continue'}
										onPress={paymentClickHandler} IsLoading={showButtonLoader}
										style={{
											marginVertical: 20,
											backgroundColor: (isPayment?(totalAmount == 0 ? Colors.gray : Colors.btnColor):Colors.btnColor),
											borderColor: (isPayment ? (totalAmount == 0 ? Colors.gray : Colors.btnBorderColor):Colors.btnBorderColor)
										}}
										textStyle={{
											color: (isPayment ? (totalAmount == 0 ? Colors.darkGray : Colors.black): Colors.black)
										}}
									/>

									</>
									
								}
							</>
						}
					</View>

					<View style={styles.loginText}>
						<Text style={styles.accountText1}>Already have an account?</Text>
						<TouchableWithoutFeedback onPress={loginClickHandler}>
							<Text style={styles.accountText2}>Login</Text>
						</TouchableWithoutFeedback>
					</View>
				</>
			}

			{
				regStep == 4 && (
				isPayment ? (<WebView
					ref={(ref) => webViewRef.current = ref}
					style={{ backgroundColor: Colors.appBg }}
					source={{ uri: GlobalFunctions.getPaymentGatewayUri(queryParams) }}
					setSupportMultipleWindows={true}
					javaScriptCanOpenWindowsAutomatically={true}
					javaScriptEnabled={true}
					onMessage={handlePaymentResponse}
				/>):(
					<>
						<Bold style={GS.headerLabel}>Signup</Bold>
						<Text style={GS.subHeaderLabel}>{stepTitles[regStep - 1]}</Text>

						{renderBatches()}

						<SubmitButton title={'Finish'} 
								IsLoading={showButtonLoader}
								onPress={examBatchesHandler}
							style={{
								marginVertical: 20,
								backgroundColor: (Colors.btnColor),
								borderColor: (Colors.btnBorderColor)
							}}
							textStyle={{
								color: (Colors.black)
							}}
						/>
					</>
				)
				)
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
		paddingTop: 5,
		paddingBottom: 20,
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

export default SignupScreen;