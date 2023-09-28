import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, ScrollView, Alert, Dimensions } from 'react-native';

import { useDispatch } from 'react-redux';

import Menu, { MenuTrigger, MenuOptions, MenuOption, renderers } from 'react-native-popup-menu';

import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';

import Constants from 'expo-constants';

import MyContainer from '../components/MyContainer';
import MyPickerInput from '../components/MyPickerInput';
import MyTextInput from '../components/MyTextInput';
import MyWebView from '../components/MyWebView';
import SubmitButton from '../components/SubmitButton';
import CancelButton from '../components/CancelButton';

import { Text, Bold } from '../components/Tags';
import * as GlobalFunctions from '../common/GlobalFunctions';
import GS from '../common/GlobalStyles';
import Colors from '../constants/Colors';
import Variables from '../constants/Variables';
import { ValidationType, TestMenuStage, QuestionReportType } from '../constants/Enums';

import * as testActions from '../store/actions/test';
import MyDialog from '../components/MyDialog';


const { ContextMenu, SlideInMenu, Popover } = renderers;
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ResultViewScreen = props => {

	const appHeaderHeight = 60;
	const maxSummaryHeight = screenHeight - Constants.statusBarHeight - appHeaderHeight - 10;

	const [isLoading, setIsLoading] = useState(true);
	const [showButtonLoader, setShowButtonLoader] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [stickMenu, setStickMenu] = useState(false);
	//const [submitMenuRef, setSubmitMenuRef] = useState();
	const [reportMenuRef, setReportMenuRef] = useState();
	const [confirmStage, setConfirmStage] = useState(TestMenuStage.Submit);

	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	const [questionsAll, setQuestionsAll] = useState([]);
	const [questions, setQuestions] = useState([]);

	const [testId, setTestId] = useState(0);
	const [testName, setTestName] = useState('');
	const [totalMarks, setTotalMarks] = useState(0);
	const [lang, setLang] = useState(2);

	const [questionNo, setQuestionNo] = useState(0);
	const [correctOptionId, setSetCorrectOptionId] = useState(0);
	const [questionCount, setQuestionCount] = useState(0);
	const [currQues, setCurrQues] = useState();

	const [isAttempted, setIsAttempted] = useState(0);
	const [selectedOptionId, setSelectedOptionId] = useState(0);
	const [selectedSurety, setSelectedSurety] = useState(0);

	const [correctQuestions, setCorrectQuestions] = useState([]);
	const [wrongQuestions, setWrongQuestions] = useState([]);
	const [leftQuestions, setLeftQuestions] = useState([]);

	const [reportType, setReportType] = useState(0);
	const [answerStatus, setAnswerStatus] = useState(0);
	const [instaRStatus, setInstaRStatus] = useState(0);

	const [showBookmarkLoader, setShowBookmarkLoader] = useState(false);
	const [summaryHeight, setSummaryHeight] = useState(maxSummaryHeight);

	const [reviewedWLQIds, setReviewedWLQIds] = useState([]);	//for wrong & left question ids
	const [isReviewed, setIsReviewed] = useState(false);

	const [showIR, setShowIR] = useState(false);
	const [reportingBoxIsVisible, setReportingBoxIsVisible] = useState(false);
	// const [irTest, setIrTest] = useState('');
	const [showInstaConfirmation, setShowInstaRConfirmationBox] = useState();
// console.log(showIR)

	const dispatch = useDispatch();

	const submitMenuRef = useRef(null);
	useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {

				setTestId(props.route.params.testId);
				setLang(props.route.params.langId);
				setTestName(props.route.params.testName);
				setTotalMarks(props.route.params.totalMarks);

				formValues['language_id'] = props.route.params.langId;

				const apiData = await dispatch(testActions.getQuestions(props.route.params.testId));

				let apiQuestions = apiData.questions;
				setQuestionsAll(apiQuestions);

				setInstaRStatus(apiData.instar_status);

				setQuestions(apiQuestions);

				for (let i = 0; i < apiQuestions.length; i++) {
					if (apiQuestions[i].is_correct == "1") {
						correctQuestions.push(apiQuestions[i].id);
					} else if (apiQuestions[i].is_correct == "0" && apiQuestions[i].is_attempted == "1") {
						wrongQuestions.push(apiQuestions[i].id);
					} else if (apiQuestions[i].is_attempted == "0") {
						leftQuestions.push(apiQuestions[i].id);
					}
				}


				let quesCount = apiQuestions.length;

				setQuestionCount(quesCount);
				setCurrQues(apiQuestions[0]);
				setSelectedSurety(apiQuestions[0].answer_surety);
				setIsAttempted(apiQuestions[0].is_attempted);
				setSelectedOptionId(apiQuestions[0].selected_option_id);
				setReportType(apiQuestions[0].reporting_type);
				formValues['remarks'] = apiQuestions[0].remarks;
				setSetCorrectOptionId(apiQuestions[0].correct_option_id);
				setQuestionNo(0);

				setShowIR(correctQuestions.length < apiQuestions.length);

				const numWidth = 50;
				const numHeight = 50;
				const headerHeight = 50 + 70;
				const buttonsHeight = 10;
				const heightForNums = maxSummaryHeight - headerHeight - buttonsHeight;
				const numInRow = screenWidth / numWidth;
				const numOfLines = parseInt(quesCount / numInRow) + (quesCount % numInRow == 0 ? 0 : 1);
				const heightRequire = numOfLines * numHeight;

				//based on max available height
				if (heightForNums > heightRequire) {
					setSummaryHeight(heightRequire + headerHeight + buttonsHeight + 10);
				}

				setIsLoading(false);
			} catch (err) {
				//setIsLoading(false);
				GlobalFunctions.showMessage('An Error Occurred!', err.message);
			}
		}
		getData();
	}, [dispatch, props]);

	const yesSelectInstaRConfirmationBox = (props, testId, testName, langId, teststopbacknavigate) => {

		props.navigation.navigate('StartTest', { testId: testId, langId: langId, testName: testName, instaR: 1, teststopbacknavigate: 2 });


	}


	if (isLoading) {
		return (
			<MyContainer navigation={props.navigation} title={"Result"} padder={false} hideLeftIcon={true} >
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primaryDark} />
				</View>
			</MyContainer>
		);
	}


	// const reviewedClickHandler = (id) => {
	// 	reviewedWLQIds.push(id);
	// 	setIsReviewed(true);

	// 	if (reviewedWLQIds.length == wrongQuestions.length + leftQuestions.length) {
	// 		updateInstaRStatus();
	// 		GlobalFunctions.showInstaRConfirmation('Start Insta-R Test ?', 'Do you want to start an Insta-R test now ?', startInstaR);
	// 	}
	// }

	// const updateInstaRStatus = async () => {
	// 	await dispatch(testActions.updateInstaRStatus(testId));
	// }

	const startInstaR = () => {
		  setShowInstaRConfirmationBox(true);
		//GlobalFunctions.navigate(props, 'StartTest', { testId: testId, langId: lang, testName: testName, instaR: 1 });
		//   GlobalFunctions.showInstaRConfirmation(props, testId, testName, totalMarks, lang, false);

	}


	const renderNextQuestion = () => {
		console.log(questions[questionNo + 1].answer_surety);
		setCurrQues(questions[questionNo + 1]);
		setSelectedSurety(questions[questionNo + 1].answer_surety);
		setIsAttempted(questions[questionNo + 1].is_attempted);
		setSelectedOptionId(questions[questionNo + 1].selected_option_id);
		setReportType(questions[questionNo + 1].reporting_type);
		formValues['remarks'] = questions[questionNo + 1].remarks;
		setSetCorrectOptionId(questions[questionNo + 1].correct_option_id);
		setQuestionNo(questionNo + 1);

		if (parseInt(questions[questionNo + 1].selected_option_id) != parseInt(questions[questionNo + 1].correct_option_id)) {
			if (reviewedWLQIds.includes(questions[questionNo + 1].id)) {
				//reviewedWLQIds.push(questions[questionNo + 1].id);
				setIsReviewed(true);
			} else {
				setIsReviewed(false);
			}
		}

	}


	const renderPrevQuestion = () => {
		setCurrQues(questions[questionNo - 1]);
		setSelectedSurety(questions[questionNo - 1].answer_surety);
		setIsAttempted(questions[questionNo - 1].is_attempted);
		setSelectedOptionId(questions[questionNo - 1].selected_option_id);
		setReportType(questions[questionNo - 1].reporting_type);
		formValues['remarks'] = questions[questionNo - 1].remarks;
		setSetCorrectOptionId(questions[questionNo - 1].correct_option_id);
		setQuestionNo(questionNo - 1);

		if (parseInt(questions[questionNo - 1].selected_option_id) != parseInt(questions[questionNo - 1].correct_option_id)) {
			if (reviewedWLQIds.includes(questions[questionNo - 1].id)) {
				//reviewedWLQIds.push(questions[questionNo - 1].id);
				setIsReviewed(true);
			} else {
				setIsReviewed(false);
			}
		}
	}

	const gotoQuestionNo = qno => {
		setCurrQues(questions[qno]);
		setSelectedSurety(questions[qno].answer_surety);
		setIsAttempted(questions[qno].is_attempted);
		setSelectedOptionId(questions[qno].selected_option_id);
		setReportType(questions[qno].reporting_type);
		formValues['remarks'] = questions[qno].remarks;
		setSetCorrectOptionId(questions[qno].correct_option_id);
		setQuestionNo(qno);

		if (parseInt(questions[qno].selected_option_id) != parseInt(questions[qno].correct_option_id)) {
			if (reviewedWLQIds.includes(questions[qno].id)) {
				//reviewedWLQIds.push(questions[qno].id);
				setIsReviewed(true);
			} else {
				setIsReviewed(false);
			}
		}

		closeMenu();
	}



	const changeAnswerStatus = (status) => {
		setAnswerStatus(status);

		let filteredQuestions = [];

		if (status == 0) {
			filteredQuestions = questionsAll;
		} else if (status == 1) {
			filteredQuestions = questionsAll.filter(x => x.is_correct == "1");
		} else if (status == 2) {
			filteredQuestions = questionsAll.filter(x => x.is_correct == "0" && x.is_attempted == "1");
		} else if (status == 3) {
			filteredQuestions = questionsAll.filter(x => x.is_attempted == "0");
		}

		setQuestions(filteredQuestions);

		setQuestionCount(filteredQuestions.length);

		if (filteredQuestions.length > 0) {
			setCurrQues(filteredQuestions[0]);
			setSelectedSurety(filteredQuestions[0].answer_surety);
			setIsAttempted(filteredQuestions[0].is_attempted);
			setSelectedOptionId(filteredQuestions[0].selected_option_id);
			setReportType(filteredQuestions[0].reporting_type);
			formValues['remarks'] = filteredQuestions[0].remarks;
			setSetCorrectOptionId(filteredQuestions[0].correct_option_id);

			if (parseInt(filteredQuestions[0].selected_option_id) != parseInt(filteredQuestions[0].correct_option_id)) {
				if (reviewedWLQIds.includes(filteredQuestions[0].id)) {
					//reviewedWLQIds.push(questions[questionNo - 1].id);
					setIsReviewed(true);
				} else {
					setIsReviewed(false);
				}
			}


		} else {
			setCurrQues(undefined);
			setSelectedSurety(undefined);
			setIsAttempted(undefined);
			setSelectedOptionId(undefined);
			setReportType(undefined);
			setSetCorrectOptionId(undefined);
		}

		setQuestionNo(0);

	}

	const renderQuestionNumbers = () => {
		let arrItems = [];

		let arrQIds = [];
		questions.map((item, index) => {
			arrQIds.push(item.id);
		})

		for (let i = 0, j = -1; i < questionsAll.length; i++) {

			if (!arrQIds.includes(questionsAll[i].id)) continue;

			j++;

			arrItems.push(
				<TouchableWithoutFeedback key={"quesNo-" + (i + 1)} onPress={() => { gotoQuestionNo(j) }}>
					<View style={{
						...GS.w40, ...GS.h40, ...GS.rounded10, ...GS.jcenter, ...GS.acenter, ...GS.m5,
						backgroundColor: correctQuestions.includes(questionsAll[i].id) ? Colors.quesCorrect :
							wrongQuestions.includes(questionsAll[i].id) ? Colors.quesWrong :
								leftQuestions.includes(questionsAll[i].id) ? Colors.quesLeft : Colors.quesUnseen
					}}>
						<Text style={{ ...GS.textWhite }}>{i + 1}</Text>
					</View>
				</TouchableWithoutFeedback>
			);
		}

		return arrItems;
	}

	const examStopClickHandler = () => {

		// console.log(props.route.params.resultbackscreen)

		if (props.route.params.resultbackscreen == 1) {

			// console.log(props.route.params)

			GlobalFunctions.navigate(props, "RemedialTestResult");

		} else if (props.route.params.resultbackscreen == 2) {

			GlobalFunctions.navigate(props, "MegaTestResult");

		}

		if (props.route.params.resultbackscreenNo == 1) {
			console.log(props.route.params.resultbackscreenNo)
			GlobalFunctions.navigate(props, "MegaTestResult");
		} else if (props.route.params.resultbackscreenNo == 2) {

			GlobalFunctions.navigate(props, "RemedialTestResult");

		}



	}

	// const testStopped = () => {
	// 	GlobalFunctions.navigate(props, "TestResult");
	// }

	const renderOptions = () => {
		let arrOptions = [];

		currQues.options.map((item, index) => {
			arrOptions.push(
				<View key={index} style={{
					...GS.row100, ...GS.rounded10, ...GS.shadow, ...GS.p7, ...GS.acenter, ...GS.mv10,
					...GS.rounded50, ...GS.border,
					...(item.id == correctOptionId ? GS.bgSuccessLight : item.id == selectedOptionId ? GS.bgLightDanger : GS.bgWhite)
				}}>
					<View style={{ ...GS.jcenter, ...GS.acenter }}>
						<Bold style={GS.fs16}>{String.fromCharCode(index + 65)}</Bold>
					</View>
					<View style={{ ...GS.f1, ...GS.ph5, ...GS.pt10 }}>
						<MyWebView html={lang == 1 ? item.option_text_en : item.option_text_hi} forOption={true}
							textColor={(item.id == correctOptionId || item.id == selectedOptionId) ? "black" : "black"} />
					</View>
					<View style={{ ...GS.w25, ...GS.acenter }}>
						<MaterialCommunityIcons size={20}
							color={item.id == correctOptionId ? Colors.success : Colors.danger && item.id == selectedOptionId ? Colors.danger : Colors.blue}
							name={item.id == correctOptionId ? "radiobox-marked" :
								item.id == selectedOptionId ? "radiobox-marked" : "checkbox-blank-circle-outline"} />
					</View>
				</View>
			);
		})

		return arrOptions;
	}

	const openMenu = (stage) => {
		try {
			setConfirmStage(stage)
			setStickMenu(true);
			if (submitMenuRef.current != undefined) {
				submitMenuRef.current.open();
			}
		} catch (err) {
			console.log('error in opening menu');
			console.log(err);
		}
	}

	const closeMenu = () => {
		try {
			setStickMenu(undefined);
			if (submitMenuRef.current != undefined) {
				submitMenuRef.current.close();
			}
		} catch (err) {
			console.log('error in closing menu');
			console.log(err);
		}
	}

	const reportQuestionClickHandler = () => {

		if (reportType == 0) {
			GlobalFunctions.showMessage('Select Reporting Reason', 'Please select a reason for reporting this question');
			return;
		}

		setIsSubmitting(true);
		setTimeout(() => {
			submitReportedQuestion();
		}, 50);

	}

	const submitReportedQuestion = async () => {

		setIsSubmitting(false);

		if (reportType == 5 && (formValues['remarks'] == undefined || formValues['remarks'] == '')) {
			GlobalFunctions.showMessage('Enter Your Comments', 'Please enter your comments and specify reason why you are reporting this question');
			return;
		}

		setShowButtonLoader(true);
		try {
			console.log(currQues);
			const apiResponse = await dispatch(testActions.reportQuestion(currQues.id, reportType, currQues.reported_id, formValues['remarks'],currQues.exam_id));
			questions[questionNo].reporting_type = reportType;
			questions[questionNo].remarks = formValues['remarks'] == undefined ? '' : formValues['remarks'];
			if (currQues.reported_id == "0") {
				questions[questionNo].reported_id = apiResponse.data;
			}

			// GlobalFunctions.showMessage('Reporting Status', apiResponse.message);
			setReportingBoxIsVisible(true);

			setShowButtonLoader(false);
			reportMenuRef.close();
		} catch (err) {
			setShowButtonLoader(false);
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
	}


	const renderReportingOptions = () => {
		const optionTexts = ['Question Language Wrong', 'Option Wrong', 'Answer Wrong', 'Explanation Wrong', 'Other'];

		let reportingOptions = [];

		if (currQues.responded_remarks != "") {
			reportingOptions.push(
				<Bold key="r_msg" style={{ ...GS.fs16, ...GS.textPrimaryDark, ...GS.mb10 }}>
					This Question and Option is already verified & updated by the Admin.{"\n"}Admin remarks:
				</Bold>
			)
			reportingOptions.push(
				<ScrollView key="r_remark" style={{ flex: 1 }} keyboardShouldPersistTaps="always">
					<TouchableWithoutFeedback>
						<Text style={{ lineHeight: 23 }}>{currQues.responded_remarks}</Text>
					</TouchableWithoutFeedback>
				</ScrollView>
			);
		} else {
			optionTexts.map((item, index) => {
				reportingOptions.push(
					<View key={"rro" + index} style={{ ...GS.row100, ...GS.mv5 }}>
						<TouchableWithoutFeedback disabled={currQues.reportable == "0"} onPress={() => setReportType(index + 1)}>
							<View style={{ ...GS.row100, ...GS.h35, ...GS.acenter, ...GS.jspaceb }}>
								<Bold style={GS.fs18}>{item}</Bold>
								{
									currQues.reportable == "1" ?
										<MaterialCommunityIcons size={23} color={Colors.black}
											name={reportType == index + 1 ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} />
										:
										<MaterialCommunityIcons size={23} color={reportType == index + 1 ? Colors.black : Colors.lightGray}
											name={reportType == index + 1 ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} />
								}
							</View>
						</TouchableWithoutFeedback>
					</View>
				);
			});
		}

		return (
			<View style={{ ...GS.w100p, ...GS.p20, height: 380 }}>
				<Bold style={{ ...GS.fs24, ...GS.tcenter, ...GS.pb25, ...GS.textPrimaryDark }}>Report Question?</Bold>

				{
					reportType == 0 || currQues.reportable != "1" ?
						reportingOptions :
						<>
							<View style={{ ...GS.row100 }}>
								<View style={GS.f1}>
									<Bold style={{ ...GS.fs17 }}>You have selected</Bold>
								</View>
								<View style={{ ...GS.f1 }}>
									<TouchableWithoutFeedback onPress={() => setReportType(0)}>
										<Bold style={{ ...GS.textPrimaryDark, ...GS.sright, ...GS.ph5, ...GS.pt2 }}>Change</Bold>
									</TouchableWithoutFeedback>
								</View>
							</View>
							<Bold style={{ ...GS.fs17, ...GS.bgPrimary, ...GS.p2 }}>{optionTexts[reportType - 1]}</Bold>
							<View style={{ ...GS.w100p }}>
								<MyTextInput name="remarks" value={formValues} error={formErrors} submitting={isSubmitting}
									initialValue={formValues['remarks']} showLabel={true} label="Your Comments"
									refs={formRefs} multiline={true} numberOfLines={5} returnKeyType="done"
									textInputStyle={{ maxHeight: 135 }} />
							</View>
						</>
				}

				{
					currQues.reportable == "1" && reportType > 0 &&
					<View style={{ ...GS.row100, ...GS.jspacea, ...GS.mt25 }}>
						<SubmitButton title="Submit" disabled={reportType == 0} IsLoading={showButtonLoader} onPress={reportQuestionClickHandler} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.mh10, ...GS.f1, ...GS.mb10, ...GS.rounded50 }} />
					</View>
				}
			</View>
		)
	}

	const bookmarkClickHandler = async () => {
		setShowBookmarkLoader(true);
		try {
			const apiResponse = await dispatch(testActions.changeBookmark(currQues.id));
			questions[questionNo].bookmarked = questions[questionNo].bookmarked == "1" ? "0" : "1";
			GlobalFunctions.showMessage('Bookmarking Status', apiResponse.message);
			setShowBookmarkLoader(false);
		} catch (err) {
			setShowBookmarkLoader(false);
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
	}

	const renderStatistics = () => {
		return (
			<View style={{ ...GS.w100p, ...GS.pt10, height: summaryHeight }}>

				<Bold style={{ ...GS.ph10, ...GS.pb35, ...GS.fs16, ...GS.textDarkGray }}>Summary</Bold>

				<View style={{ ...GS.row100, ...GS.h50, ...GS.bgheadingColor, ...GS.jspaceb, ...GS.acenter, ...GS.mb30, ...GS.rounded5 }}>
					<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter, ...GS.shadow }}>
						<View style={{ ...GS.w40, ...GS.h40, ...GS.rounded10, ...GS.jcenter, ...GS.acenter, backgroundColor: Colors.quesCorrect }}>
							<Text style={{ ...GS.textWhite }}>{correctQuestions.length}</Text>
						</View>
						<Text style={{ ...GS.textWhite, ...GS.pt2 }}>Correct</Text>
					</View>

					<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter, ...GS.shadow }}>
						<View style={{ ...GS.w40, ...GS.h40, ...GS.rounded10, ...GS.jcenter, ...GS.acenter, backgroundColor: Colors.quesWrong }}>
							<Text style={{ ...GS.textWhite }}>{wrongQuestions.length}</Text>
						</View>
						<Text style={{ ...GS.textWhite, ...GS.pt2 }}>Wrong</Text>
					</View>

					<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter, ...GS.shadow }}>
						<View style={{ ...GS.w40, ...GS.h40, ...GS.rounded10, ...GS.jcenter, ...GS.acenter, backgroundColor: Colors.quesLeft }}>
							<Text style={{ ...GS.textWhite }}>{leftQuestions.length}</Text>
						</View>
						<Text style={{ ...GS.textWhite, ...GS.pt2 }}>Left</Text>
					</View>
				</View>

				<ScrollView keyboardShouldPersistTaps="handled">
					<TouchableWithoutFeedback>
						<View style={{ ...GS.row100, ...GS.fwrap }}>
							{renderQuestionNumbers()}
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</View>
		)
	}


	return (

		<MyContainer navigation={props.navigation} title={"Result"} padder={false} hideLeftIcon={true} showExamStopIcon={true}
			examStopClickHandler={examStopClickHandler} showInstaRIcon={showIR && instaRStatus == '2'}
			instaRClickHandler={startInstaR} /*submitMenuRef={submitMenuRef} menuClose={() => closeMenu()}*/ >

			<View style={{ ...GS.ph10, ...GS.pv10 }}>
				<View style={{ ...GS.row100, ...GS.jspaceb, ...GS.pv10 }}>
					<View style={GS.mr10}>
						<Bold style={{ ...GS.fs14, ...GS.textDarkGray }}>Paper Name :</Bold>
					</View>
					<View style={GS.f1}>
						<Bold style={{ ...GS.fs14, ...GS.textDarkGray }}>{testName}</Bold>
					</View>
				</View>
				<View style={{ ...GS.row100, ...GS.jspaceb }}>
					<View style={GS.mr10}>
						<Bold style={{ ...GS.fs14, ...GS.textBlue }}>Total Marks :</Bold>
					</View>
					<View style={GS.f1}>
						<Bold style={{ ...GS.fs14, ...GS.textBlue }}>{totalMarks}</Bold>
					</View>
				</View>
			</View>

			<MyDialog isVisible={reportingBoxIsVisible} hideDialog={() => setReportingBoxIsVisible(false)}
				title="Reporting Status"
				style={{ ...GS.rounded10, height: 250, ...GS.bgWhite }}>
				<View style={{ ...GS.h80 }}>
					<Text style={{ ...GS.fs18, ...GS.tcenter }}  >Question reported successfully.</Text>
				</View>
				<View style={{ ...GS.h60 }}>
					<SubmitButton title="Ok" onPress={() => setReportingBoxIsVisible(false)} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgLightGreen, ...GS.minw75, ...GS.f1, ...GS.mb10 }} />
				</View>
			</MyDialog>
			<MyDialog isVisible={showInstaConfirmation} hideDialog={() => setShowInstaRConfirmationBox(false)} titleStyle={{ ...GS.textWhite }}
				title="इंस्टा-आर टेस्ट शुरू करें?"
				style={{ ...GS.rounded10, height: 290, ...GS.bgheadingColor }}>
				<View style={{ ...GS.h80, }}>
					<Text style={{ ...GS.fs17, ...GS.tcenter, ...GS.textWhite }}  >क्या आपने इस {testName} के गलत सवाल या छोडे हुये सवाल और उनके जवाब पढ़ लिए है? </Text>
				</View>
				<View style={{ ...GS.h60 }}>
					<SubmitButton title="हां" onPress={() => yesSelectInstaRConfirmationBox(props, testId, testName, totalMarks, lang, false)} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.minw75, ...GS.f1, ...GS.mb10, ...GS.border3, ...GS.borderWhite }} />
				</View>
				<View style={{ ...GS.h60 }}>
					<SubmitButton title="नहीं" onPress={() => setShowInstaRConfirmationBox(false)} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.minw75, ...GS.f1, ...GS.mb10, ...GS.border3, ...GS.borderWhite }} />
				</View>
			</MyDialog>
			<View style={{ ...GS.row100, ...GS.bgPrimary }}>

				<TouchableWithoutFeedback onPress={() => changeAnswerStatus(0)}>
					<View style={{ ...GS.f1, ...GS.h30, ...GS.acenter, ...GS.jcenter, ...(answerStatus == 0 ? GS.bgPrimaryDark : GS.bgPrimary) }}>
						<Bold style={{ ...GS.bold, ...(answerStatus == 0 ? GS.textWhite : GS.textBlack) }}>All</Bold>
					</View>
				</TouchableWithoutFeedback>

				<TouchableWithoutFeedback onPress={() => changeAnswerStatus(1)}>
					<View style={{ ...GS.f1, ...GS.h30, ...GS.acenter, ...GS.jcenter, ...GS.borderLeft, ...(answerStatus == 1 ? GS.bgPrimaryDark : GS.bgPrimary) }}>
						<Bold style={{ ...(answerStatus == 1 ? GS.textWhite : GS.textBlack) }}>Correct</Bold>
					</View>
				</TouchableWithoutFeedback>

				<TouchableWithoutFeedback onPress={() => changeAnswerStatus(2)}>
					<View style={{ ...GS.f1, ...GS.h30, ...GS.acenter, ...GS.jcenter, ...GS.borderLeft, ...(answerStatus == 2 ? GS.bgPrimaryDark : GS.bgPrimary) }}>
						<Bold style={{ ...(answerStatus == 2 ? GS.textWhite : GS.textBlack) }}>Wrong</Bold>
					</View>
				</TouchableWithoutFeedback>

				<TouchableWithoutFeedback onPress={() => changeAnswerStatus(3)}>
					<View style={{ ...GS.f1, ...GS.h30, ...GS.acenter, ...GS.jcenter, ...GS.borderLeft, ...(answerStatus == 3 ? GS.bgPrimaryDark : GS.bgPrimary) }}>
						<Bold style={{ ...(answerStatus == 3 ? GS.textWhite : GS.textBlack) }}>Left</Bold>
					</View>
				</TouchableWithoutFeedback>

			</View>

			<View style={{ ...GS.row100, marginTop: -10 }}>
				<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter }}>
					{
						answerStatus == 0 &&
						<Ionicons name="caret-down" size={24} color={Colors.primaryDark} />
					}
				</View>
				<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter }}>
					{
						answerStatus == 1 &&
						<Ionicons name="caret-down" size={24} color={Colors.primaryDark} />
					}
				</View>
				<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter }}>
					{
						answerStatus == 2 &&
						<Ionicons name="caret-down" size={24} color={Colors.primaryDark} />
					}
				</View>
				<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter }}>
					{
						answerStatus == 3 &&
						<Ionicons name="caret-down" size={24} color={Colors.primaryDark} />
					}
				</View>
			</View>

			{
				currQues != undefined ?
					<View style={{ ...GS.ph20 }}>
						<View style={{ ...GS.row100, ...GS.mt15, ...GS.mb5 }}>
							<View style={{ ...GS.f1 }}>
								<Bold style={GS.fs24}>Question {questionNo + 1}/<Text style={GS.fs16}>{questionCount}</Text></Bold>
							</View>

							<View style={{ ...GS.w50, ...GS.aright, ...GS.jcenter }}>
								<Menu
									ref={submitMenuRef}
									renderer={SlideInMenu}
									rendererProps={{ anchorStyle: styles.anchorStyle }}
								//onOpen={() => { setReportType(currQues.reporting_type) }}
								>
									<MenuTrigger>
										<TouchableWithoutFeedback onPress={() => { openMenu(TestMenuStage.Submit) }}>
											<Ionicons name="information-circle" size={24} color="lightgreen" />
										</TouchableWithoutFeedback>
									</MenuTrigger>
									<MenuOptions customStyles={optionsStyles} >
										<MenuOption onSelect={() => { return false; }}>
											{renderStatistics()}
										</MenuOption>
									</MenuOptions>
								</Menu>
							</View>

							<View style={{ ...GS.w50, ...GS.aright, ...GS.jcenter }}>
								<Menu
									ref={r => setReportMenuRef(r)}
									renderer={SlideInMenu}
									rendererProps={{ anchorStyle: styles.anchorStyle }}
									onOpen={() => { setReportType(currQues.reporting_type) }}
								>
									<MenuTrigger>
										<MaterialIcons name="report" size={24} color={Colors.warning} />
									</MenuTrigger>
									<MenuOptions customStyles={optionsStyles} >
										<MenuOption onSelect={() => { return false; }}>
											{renderReportingOptions()}
										</MenuOption>
									</MenuOptions>
								</Menu>
							</View>

						</View>
						<View style={GS.h20}>
						</View>

						{
							currQues != undefined &&
							<>
								<MyWebView html={lang == 1 ? currQues.question_en : currQues.question_hi} />
								{renderOptions()}
							</>
						}

						<Bold style={{ ...GS.mt30, ...GS.mb10, ...GS.fs16, ...GS.tcenter }}>
							{lang == 1 ? "How much sure you are about your answer?" : "आप अपने उत्तर को लेकर कितने आश्वस्त हैं?"}
						</Bold>


						<View style={{ ...GS.border, ...GS.borderBlue, ...GS.rounded5, ...GS.row100, ...GS.jspaceb, ...GS.pv2, ...GS.bgWhite, ...GS.shadow, }}>
							<View style={{
								...GS.f1, ...GS.h40, ...GS.jcenter, ...GS.rounded5, ...GS.acenter,
								...(selectedSurety == 1 ? GS.bgheadingColorLight : GS.bgWhite)
							}}>
								<Bold style={{ ...GS.fs16, ...GS.textSuccess }}>100%</Bold>
							</View>
							<View style={{
								...GS.borderLeft, ...GS.borderRight,
								...GS.f1, ...GS.h40, ...GS.jcenter, ...GS.acenter,
								...(selectedSurety == 2 ? GS.bgheadingColorLight : GS.bgWhite)
							}}>
								<Bold style={{ ...GS.fs16, ...GS.textDarkGray }}>50%</Bold>
							</View>
							<View style={{
								...GS.f1, ...GS.h40, ...GS.jcenter, ...GS.acenter,
								...(selectedSurety == 3 ? GS.bgheadingColorLight : GS.bgWhite)
							}}>
								<Bold style={{ ...GS.fs16, ...GS.textDanger }}>तुक्का</Bold>
							</View>
						</View>


						{
							((lang == 1 && currQues.answer_explanation_en != "") || (lang == 2 && currQues.answer_explanation_hi != "")) &&
							<View style={{ ...GS.mt25 }}>
								<Bold style={{ ...GS.mb5, ...GS.textPrimaryDark, ...GS.fs16 }}>Explanation:</Bold>
								<MyWebView html={lang == 1 ? currQues.answer_explanation_en : currQues.answer_explanation_hi} />
							</View>
						}

						{
							currQues.video_link != "" &&
							<View style={{ ...GS.mt25 }}>
								<Bold style={{ ...GS.mb5, ...GS.textBlack, ...GS.fs16 }}>Reference Video:</Bold>
								<TouchableWithoutFeedback onPress={() => GlobalFunctions.openExternalUri(currQues.video_link)}>
									<Text style={{ color: Colors.blue }}>{currQues.video_link}</Text>
								</TouchableWithoutFeedback>
							</View>
						}

						{
							currQues.attachment_link != "" &&
							<View style={{ ...GS.mt25 }}>
								<Bold style={{ ...GS.mb5, ...GS.textBlack, ...GS.fs16 }}>Reference Attachment:</Bold>
								<TouchableWithoutFeedback onPress={() => GlobalFunctions.openExternalUri(currQues.attachment_link)}>
									<Text style={{ color: Colors.blue }}>{currQues.attachment_link}</Text>
								</TouchableWithoutFeedback>
							</View>
						}

						{/* {
							correctOptionId != selectedOptionId && !isReviewed &&
							<SubmitButton title="Ok, I got what i missed" onPress={() => reviewedClickHandler(currQues.id)}
								style={{ ...GS.scenter, ...GS.bgWarning, ...GS.borderWarning }} />
						} */}

						<View style={{ ...GS.jspacea, ...GS.mt20, ...GS.mb15 }}>
							{
								questionNo > 0 &&
								<CancelButton title="Prev" onPress={renderPrevQuestion} disabled={questionNo == 0} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgLightGreen, ...GS.mh10, ...GS.f1, ...GS.minw100, ...GS.mb10, ...GS.rounded50 }} />
							}
							{
								questionNo < questionCount - 1 &&
								<SubmitButton title="Next" onPress={renderNextQuestion} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.mh10, ...GS.f1, ...GS.minw100, ...GS.mb10, ...GS.rounded50 }} />
							}
						</View>


					</View>
					:
					<View style={{ ...GS.acenter, ...GS.mt40 }}>
						<Bold>No Questions Found</Bold>
					</View>
			}
		</MyContainer >

	)
}

const optionsStyles = {
	optionsContainer: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
}

const styles = StyleSheet.create({
	txtPrefLang: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		marginRight: 5,
		paddingBottom: 8
	},
	progressBar: {
		height: 10,
		marginBottom: 15,
		borderRadius: 10,
		backgroundColor: Colors.white,

		elevation: 5,
		shadowOffset: {
			width: 5,
			height: 5
		},
		shadowColor: Colors.lightBlack,
		shadowOpacity: 0.5,
		shadowRadius: 5,
	},
	progressIndicator: {
		height: '100%',
		borderRadius: 9,
		backgroundColor: Colors.primaryDark,
	}
})

export default ResultViewScreen;
