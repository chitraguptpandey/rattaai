import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, ScrollView, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';

import Menu, { MenuTrigger, MenuOptions, MenuOption, renderers } from 'react-native-popup-menu';

import { MaterialCommunityIcons, MaterialIcons, FontAwesome5, Fontisto } from '@expo/vector-icons';

import Constants from 'expo-constants';

import MyContainer from '../components/MyContainer';
import MyPickerInput from '../components/MyPickerInput';
import MyWebView from '../components/MyWebView';
import SubmitButton from '../components/SubmitButton';
import CancelButton from '../components/CancelButton';
import CountdownTimer from '../components/CountdownTimer';

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
const StartTestScreen = props => {

	const appHeaderHeight = 60;
	const maxSummaryHeight = screenHeight - Constants.statusBarHeight - appHeaderHeight - 10;
	const [isLoading, setIsLoading] = useState(true);
	const [showButtonLoader, setShowButtonLoader] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [stickMenu, setStickMenu] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isVisibleExamStop, setIsVisibleExamStop] = useState(false);


	//const [submitMenuRef, setSubmitMenuRef] = useState();
	const [reportMenuRef, setReportMenuRef] = useState();
	const [confirmStage, setConfirmStage] = useState(TestMenuStage.Submit);

	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	const [questions, setQuestions] = useState([]);
	const [progressPercent, setProgressPercent] = useState('0%');

	const [testId, setTestId] = useState(0);
	const [testName, setTestName] = useState('');
	const [duration, setDuration] = useState(0);
	const [lang, setLang] = useState(2);

	const [questionNo, setQuestionNo] = useState(0);
	const [correctOptionId, setSetCorrectOptionId] = useState(0);
	const [questionCount, setQuestionCount] = useState(0);
	const [currQues, setCurrQues] = useState();

	const [totalSeconds, setTotalSeconds] = useState(0);
	const [requireTimerStop, setRequireTimerStop] = useState(false);

	//const [currentQues, setCurrentQues] = useState(0);
	const [isAttempted, setIsAttempted] = useState(0);
	const [selectedOptionId, setSelectedOptionId] = useState(0);
	const [selectedSurety, setSelectedSurety] = useState(0);

	const [attemptedCount, setAttemptedCount] = useState(0);
	const [unattemptedCount, setUnattemptedCount] = useState(0);

	const [attemptedQuestions, setAttemptedQuestions] = useState([]);
	const [skippedQuestions, setSkippedQuestions] = useState([]);
	const [seenQuestions, setSeenQuestions] = useState([]);

	const [reportType, setReportType] = useState(0);
	const [summaryHeight, setSummaryHeight] = useState(maxSummaryHeight);

	const [isInstaR, setIsInstaR] = useState(0);

	const dispatch = useDispatch();

	const submitMenuRef = useRef(null);

	useEffect(() => {

		console.log()
		const getData = async () => {
			setIsLoading(true);
			try {

				setIsInstaR(props.route.params.instaR);
				setTestId(props.route.params.testId);
				setLang(props.route.params.langId);
				setTestName(props.route.params.testName);
				setDuration(parseInt(props.route.params.duration));

				formValues['language_id'] = props.route.params.langId;

				const apiData = await dispatch(testActions.getQuestions(props.route.params.testId, props.route.params.instaR));

				const strMegaTestCache = await AsyncStorage.getItem('megaTestCache');
				let lastQuesNo = 0;
				if (strMegaTestCache != undefined && strMegaTestCache != '') {
					const objMegaTestCache = JSON.parse(strMegaTestCache);
					setTotalSeconds(objMegaTestCache.remainingSeconds);
					for (let i = 0; i < apiData.questions.length; i++) {
						const mtc = objMegaTestCache.answerInputs.filter(x => x.id.toString() == apiData.questions[i].id.toString());
						if (mtc.length > 0) {
							apiData.questions[i].answer_surety = mtc[0].answer_surety;
							apiData.questions[i].is_attempted = mtc[0].is_attempted;
							apiData.questions[i].is_correct = mtc[0].is_correct;
							apiData.questions[i].selected_option_id = mtc[0].selected_option_id;
						}
					}
					lastQuesNo = objMegaTestCache.lastQuesNo;
					setSeenQuestions(objMegaTestCache.seenQuestions);
				}
				else {
					setTotalSeconds(parseInt(props.route.params.duration) * 60);
					seenQuestions.push(1);
				}

				let apiQuestions = apiData.questions;
				setQuestions(apiQuestions);

				let quesCount = apiQuestions.length;

				setQuestionCount(quesCount);

				setCurrQues(apiQuestions[lastQuesNo]);
				setSelectedSurety(apiQuestions[lastQuesNo].answer_surety);
				setIsAttempted(apiQuestions[lastQuesNo].is_attempted);
				setSelectedOptionId(apiQuestions[lastQuesNo].selected_option_id);
				setReportType(apiQuestions[lastQuesNo].reporting_type);
				setSetCorrectOptionId(apiQuestions[lastQuesNo].correct_option_id);
				setQuestionNo(lastQuesNo);

				const percent = parseInt(lastQuesNo * 100 / apiData.questions.length);
				setProgressPercent(percent + '%');

				const numWidth = 50;
				const numHeight = 50;
				const headerHeight = 50 + 120;
				const buttonsHeight = 100;
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

	const onTimeFinished = () => {
		setConfirmStage(TestMenuStage.Timeout);
		setStickMenu(true);
		submitMenuRef.current.open();
	}

	if (isLoading) {
		return (
			<MyContainer navigation={props.navigation} title={testName} padder={false} hideLeftIcon={true}>
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primaryDark} />
				</View>
			</MyContainer>
		);
	}

	const renderPrevQuestion = () => {
		const quesNo = questionNo;

		if (questions[questionNo].selected_option_id > 0) {
			if (questions[questionNo].answer_surety == 0) {
				setIsVisible(true);
				// GlobalFunctions.showMessage("Please select surety", "Please select surety to tell us about how much sure you are about your answer");

				return;
			} else {
				if (skippedQuestions.includes(questionNo + 1)) {
					const newArr = GlobalFunctions.removeFromArray(skippedQuestions, questionNo + 1);
					setSkippedQuestions(newArr);
				}
			}
			if (!attemptedQuestions.includes(questionNo + 1)) {
				attemptedQuestions.push(questionNo + 1);
			}
		} else {
			if (!skippedQuestions.includes(questionNo + 1)) {
				skippedQuestions.push(questionNo + 1);
			}
			if (attemptedQuestions.includes(questionNo + 1)) {
				const newArr = GlobalFunctions.removeFromArray(attemptedQuestions, questionNo + 1);
				setAttemptedQuestions(newArr);
			}
		}

		setCurrQues(questions[questionNo - 1]);
		setSelectedSurety(questions[questionNo - 1].answer_surety);
		setIsAttempted(questions[questionNo - 1].is_attempted);
		setSelectedOptionId(questions[questionNo - 1].selected_option_id);
		setReportType(questions[questionNo - 1].reporting_type);
		setSetCorrectOptionId(questions[questionNo - 1].correct_option_id);
		setQuestionNo(questionNo - 1);

		if (!seenQuestions.includes(questionNo)) {
			seenQuestions.push(questionNo);
		}

		const percent = parseInt(quesNo * 100 / questions.length);
		setProgressPercent(percent + '%');
	}

	const renderNextQuestion = () => {
		const quesNo = questionNo + 2;

		if (questions[questionNo].selected_option_id > 0) {
			if (questions[questionNo].answer_surety == 0) {
				setIsVisible(true);
				// GlobalFunctions.showMessage("Please select surety", "Please select surety to tell us about how much sure you are about your answer");
				return;
			} else {
				if (skippedQuestions.includes(questionNo + 1)) {
					const newArr = GlobalFunctions.removeFromArray(skippedQuestions, questionNo + 1);
					setSkippedQuestions(newArr);
				}
			}
			if (!attemptedQuestions.includes(questionNo + 1)) {
				attemptedQuestions.push(questionNo + 1);
			}
		} else {
			if (!skippedQuestions.includes(questionNo + 1)) {
				skippedQuestions.push(questionNo + 1);
			}
			if (attemptedQuestions.includes(questionNo + 1)) {
				const newArr = GlobalFunctions.removeFromArray(attemptedQuestions, questionNo + 1);
				setAttemptedQuestions(newArr);
			}
		}

		if (!seenQuestions.includes(quesNo)) {
			seenQuestions.push(quesNo);
		}

		setCurrQues(questions[questionNo + 1]);
		setSelectedSurety(questions[questionNo + 1].answer_surety);
		setIsAttempted(questions[questionNo + 1].is_attempted);
		setSelectedOptionId(questions[questionNo + 1].selected_option_id);
		setReportType(questions[questionNo + 1].reporting_type);

		setSetCorrectOptionId(questions[questionNo + 1].correct_option_id);
		setQuestionNo(questionNo + 1);

		const percent = parseInt(quesNo * 100 / questions.length);
		setProgressPercent(percent + '%');
	}

	const gotoQuestionNo = qno => {
		setCurrQues(questions[qno]);
		setSelectedSurety(questions[qno].answer_surety);
		setIsAttempted(questions[qno].is_attempted);
		setSelectedOptionId(questions[qno].selected_option_id);
		setReportType(questions[qno].reporting_type);
		setSetCorrectOptionId(questions[qno].correct_option_id);
		setQuestionNo(qno);

		if (!seenQuestions.includes(qno + 1)) {
			seenQuestions.push(qno + 1);
		}

		const percent = parseInt((qno + 1) * 100 / questions.length);
		setProgressPercent(percent + '%');

		closeMenu();
	}

	const showStatsAndSubmit = () => {

		if (questions[questionNo].selected_option_id > 0) {
			if (questions[questionNo].answer_surety == 0) {
				setIsVisible(true);
				// GlobalFunctions.showMessage("Please select surety", "Please select surety to tell us about how much sure you are about your answer");
				return;
			} else {
				if (skippedQuestions.includes(questionNo + 1)) {
					const newArr = GlobalFunctions.removeFromArray(skippedQuestions, questionNo + 1);
					setSkippedQuestions(newArr);
				}
			}

			if (!attemptedQuestions.includes(questionNo + 1)) {
				attemptedQuestions.push(questionNo + 1);
			}
		} else if (attemptedQuestions.includes(questionNo + 1)) {
			const newArr = GlobalFunctions.removeFromArray(attemptedQuestions, questionNo + 1);
			setAttemptedQuestions(newArr);
		}

		const res = questions.filter(x => x.is_attempted == 1);
		setAttemptedCount(res.length);
		setUnattemptedCount(questionCount - res.length);
		openMenu(TestMenuStage.Submit);
	}

	const submitTestClickHandler = async () => {

		setShowButtonLoader(true);

		let studentAnswers = [];
		questions.map((item) => {
			studentAnswers.push({
				'question_id': parseInt(item.id),
				'selected_option_id': parseInt(item.selected_option_id),
				'correct_option_id': parseInt(item.correct_option_id),
				'is_attempted': parseInt(item.selected_option_id) != 0 ? 1 : 0,
				'is_correct': parseInt(item.selected_option_id) == parseInt(item.correct_option_id) ? 1 : 0,
				'answer_surety': parseInt(item.answer_surety)
			});
		});

		formValues['exam_id'] = Variables.ExamId;
		formValues['batch_id'] = Variables.BatchId;
		formValues['test_id'] = testId;
		formValues['answers'] = JSON.stringify(studentAnswers);
		formValues['instaR'] = isInstaR;

		try {
			await dispatch(testActions.submitTest(formValues));

			AsyncStorage.setItem('megaTestCache', '');

			setShowButtonLoader(false);

			setRequireTimerStop(true);

			if (submitMenuRef != undefined && submitMenuRef.current != undefined) {
				closeMenu();
				setTimeout(() => {
					openMenu(TestMenuStage.Submitted);
				}, 400);
			}
		} catch (err) {
			setShowButtonLoader(false);
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
	}

	const renderQuestionNumbers = () => {
		let arrItems = [];

		for (let i = 1; i <= questionCount; i++) {
			arrItems.push(
				<TouchableWithoutFeedback key={"quesNo-" + i} onPress={() => gotoQuestionNo(i - 1)}>
					<View style={{
						...GS.w40, ...GS.h40, ...GS.rounded10, ...GS.jcenter, ...GS.acenter, ...GS.m5,
						backgroundColor: attemptedQuestions.includes(i) ? Colors.quesAttempted :
							skippedQuestions.includes(i) ? Colors.quesSkipped :
								seenQuestions.includes(i) ? Colors.quesUnAttempted : Colors.quesUnseen
					}}>
						<Text style={{ ...GS.textWhite }}>{i}</Text>
					</View>
				</TouchableWithoutFeedback>
			);
		}

		return arrItems;
	}

	const markAnswer = optionId => {
		if (parseInt(questions[questionNo].selected_option_id) == parseInt(optionId)) {
			setSelectedOptionId(0);
			setIsAttempted(0);
			setSelectedSurety(0);
			questions[questionNo].selected_option_id = 0;
			questions[questionNo].is_attempted = 0;
			questions[questionNo].answer_surety = 0;

			//update only when deselecting answer again
			updateMyCache();
		} else {
			setSelectedOptionId(parseInt(optionId));
			setIsAttempted(1);
			questions[questionNo].selected_option_id = parseInt(optionId);
			questions[questionNo].is_attempted = 1;
			questions[questionNo].answer_surety = 0;
		}
	}

	const suretyClickHandler = (sno) => {
		if (sno == questions[questionNo].answer_surety) {
			setSelectedSurety(0);
			questions[questionNo].answer_surety = 0;
		} else {
			setSelectedSurety(sno);
			questions[questionNo].answer_surety = sno;
		}
		updateMyCache();
	}

	const updateMyCache = () => {
		let arrInputs = [];

		questions.map((item, index) => {
			arrInputs.push({
				id: item.id,
				answer_surety: item.answer_surety,
				is_attempted: item.is_attempted,
				is_correct: item.is_correct,
				selected_option_id: item.selected_option_id
			});
		});

		const cacheData = {
			testId: testId,
			answerInputs: arrInputs,
			lastQuesNo: questionNo,
			remainingSeconds: Variables.RemainingSeconds,
			seenQuestions: seenQuestions,
			isInstaR: isInstaR
		};

		AsyncStorage.setItem('megaTestCache', JSON.stringify(cacheData));
	}

	const examStopClickHandler = () => {

		setIsVisibleExamStop(true);
		// GlobalFunctions.showConfirmation('Quit From Test?', 'Are you sure you want to quit from the test?', testStopped);

	}


	const testStopped = () => {


		console.log(props.route.params);
		setRequireTimerStop(true);
		setTimeout(() => {
			if (props.route.params.screen == 0) {
				GlobalFunctions.navigate(props, "MegaTest");
			}
			else if (props.route.params.screen == 1) {
				GlobalFunctions.navigate(props, "RemedialTest");
			}
			else if (props.route.params.teststopbacknavigate == 1) {
				GlobalFunctions.navigate(props, "RemedialTestResult");

			}
			else if (props.route.params.teststopbacknavigate == 2) {

				GlobalFunctions.navigate(props, "MegaTestResult");

			}

		}, 100);
		updateMyCache();
	}

	const renderOptions = () => {
		let arrOptions = [];

		currQues.options.map((item, index) => {
			arrOptions.push(
				<TouchableWithoutFeedback key={index} onPress={() => markAnswer(item.id)}>
					<View style={{
						...GS.row100, ...GS.rounded10, ...GS.shadow, ...GS.p7, ...GS.acenter, ...GS.mv10,
						...GS.rounded50, ...GS.border, 
						...(item.id == selectedOptionId ? GS.bgheadingColorLight : GS.bgWhite)
					}}>
						<View style={{ ...GS.jcenter, ...GS.acenter }}>
							<Bold style={GS.fs16}>({String.fromCharCode(index + 97)})</Bold>
						</View>
						<View style={{ ...GS.f1, ...GS.ph5, ...GS.pt10 }}>
							<MyWebView html={lang == 1 ? item.option_text_en : item.option_text_hi} forOption={true} textColor="black" />
						</View>
						<View style={{ ...GS.w25, ...GS.acenter }}>
							<MaterialCommunityIcons size={20}
								color={item.id == selectedOptionId ? Colors.blue : Colors.blue}
								name={item.id == selectedOptionId ? "radiobox-marked" : "checkbox-blank-circle-outline"} />
						</View>
					</View>
				</TouchableWithoutFeedback>
			);
		})

		return arrOptions;
	}

	const renderSubmitConfirm = () => {
		return (
			<View style={{ ...GS.w100p, height: 250, ...GS.bgheadingColor, ...GS.noBorder }}>
				<Bold style={{ ...GS.fs24, ...GS.tcenter, ...GS.pv10, ...GS.textWhite }}>Are you sure?</Bold>
				<Bold style={{ ...GS.fs18, ...GS.tcenter, ...GS.pb10, ...GS.textWhite }}>After pressing the Yes button you {'\n'} cannot resume the test </Bold>
				<View style={{ ...GS.jspacea, }}>
					<View style={{ ...GS.h60, ...GS.mh10 }}>
						<SubmitButton title="Yes" IsLoading={showButtonLoader} onPress={submitTestClickHandler} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgBlueDark, ...GS.minw75, ...GS.f1, ...GS.mb10 ,...GS.mh10 }} />
					</View>
					<View style={{ ...GS.h60 }}>
						<CancelButton title="No" disabled={showButtonLoader} onPress={() => closeMenu()} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.minw75, ...GS.rounded50, ...GS.f1, ...GS.mb10, ...GS.border3, ...GS.borderWhite, ...GS.mh20 }} />
					</View>

				</View>
			</View>


		)
	}

	const renderTimeoutStatus = () => {
		return (
			<View style={{ ...GS.w100p, ...GS.pt20, height: 250 }}>
				<Bold style={{ ...GS.fs24, ...GS.tcenter, ...GS.pv10, color: Colors.danger }}>Time up</Bold>
				<Bold style={{ ...GS.fs18, ...GS.tcenter, ...GS.pv10, ...GS.ph15 }}>Your test is submitting now as its time has ended</Bold>
				<View style={{ ...GS.row100, ...GS.jspacea, ...GS.mt20 }}>
					<SubmitButton title="OK" IsLoading={showButtonLoader} onPress={submitTestClickHandler} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgDanger, ...GS.minw75, ...GS.mh30, ...GS.f1, ...GS.mb10 }} />
				</View>
			</View>
		)
	}


	const renderSubmitStatus = () => {
		return (
			<View style={{ ...GS.w100p, ...GS.pt35, height: 220 }}>
				<Text style={{ ...GS.fs20, ...GS.tcenter, ...GS.pv15 }}>Test Submitted Successfully</Text>
				<View style={{ ...GS.row100, ...GS.mt25 }}>

					<SubmitButton title="Ok" onPress={backToTestList} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgLightGreen, ...GS.minw75, ...GS.mh30, ...GS.f1, ...GS.mb10 }} />

				</View>
			</View>
		)
	}

	const backToTestList = () => {
		setRequireTimerStop(true);
		setTimeout(() => {
			closeMenu();
			if (props.route.params.screen == 0) {
				GlobalFunctions.navigate(props, "MegaTestResult");
			}
			else if (props.route.params.screen == 1) {
				GlobalFunctions.navigate(props, "RemedialTestResult");
			}
			else if (props.route.params.mega == 1) {
				GlobalFunctions.navigate(props, "MegaTestResult");
			}
			else if (props.route.params.mega == 2) {
				GlobalFunctions.navigate(props, "RemedialTestResult");
			}
		}, 100);
	}

	const takeReConfirmation = () => {
		closeMenu();
		setTimeout(() => {
			openMenu(TestMenuStage.ReConfirm);
			setStickMenu(true);
		}, 400);
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

	const renderStatistics = () => {
		return (
			<View style={{ ...GS.w100p, ...GS.pt10, height: summaryHeight }}>

				<Bold style={{ ...GS.ph10, ...GS.pb35, ...GS.fs16, ...GS.textDarkGray }}>Summary</Bold>

				<View style={{ ...GS.row100, ...GS.h50, ...GS.bgheadingColor, ...GS.jspaceb, ...GS.acenter, ...GS.mb20, ...GS.rounded5 }}>
					{/* <View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter }}>
						<View style={{ ...GS.w40, ...GS.h40, ...GS.rounded10, ...GS.jcenter, ...GS.acenter, backgroundColor: Colors.quesTotal }}>
							<Text style={{ ...GS.textWhite }}>{questionCount}</Text>
						</View>
						<Text>Total</Text>
					</View> */}

					<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter, ...GS.pb20 }}>
						<View style={{ ...GS.w40, ...GS.h40, ...GS.rounded10, ...GS.jcenter, ...GS.acenter, backgroundColor: Colors.quesAttempted, ...GS.shadow }}>
							<Text style={{ ...GS.textWhite }}>{attemptedCount}</Text>
						</View>
						<Text style={{ ...GS.textWhite, ...GS.pt2 }}>Attempted</Text>
					</View>

					<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter, ...GS.pb20 }}>
						<View style={{ ...GS.w40, ...GS.h40, ...GS.rounded10, ...GS.jcenter, ...GS.acenter, backgroundColor: Colors.quesUnAttempted, ...GS.shadow }}>
							<Text style={{ ...GS.textWhite }}>{seenQuestions.length - skippedQuestions.length - attemptedCount}</Text>
						</View>
						<Text style={{ ...GS.textWhite, ...GS.pt2 }}>UnAttempted</Text>
					</View>

					<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter, ...GS.pb20 }}>
						<View style={{ ...GS.w40, ...GS.h40, ...GS.rounded10, ...GS.jcenter, ...GS.acenter, backgroundColor: Colors.quesUnseen, ...GS.shadow }}>
							<Text style={{ ...GS.textWhite }}>{questionCount - seenQuestions.length}</Text>
						</View>
						<Text style={{ ...GS.textWhite, ...GS.pt2 }}>Unseen</Text>
					</View>

					<View style={{ ...GS.f1, ...GS.jcenter, ...GS.acenter, ...GS.pb20 }}>
						<View style={{ ...GS.w40, ...GS.h40, ...GS.rounded10, ...GS.jcenter, ...GS.acenter, backgroundColor: Colors.quesSkipped, ...GS.shadow }}>
							<Text style={{ ...GS.textWhite }}>{skippedQuestions.length}</Text>
						</View>
						<Text style={{ ...GS.textWhite, ...GS.pt2 }}>Skipped</Text>
					</View>
				</View>

				<ScrollView keyboardShouldPersistTaps="handled">
					<TouchableWithoutFeedback>
						<View style={{ ...GS.row100, ...GS.fwrap }}>
							{renderQuestionNumbers()}
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>

				<View style={{ ...GS.row100, ...GS.jspacea, ...GS.mt25 }}>
					<CancelButton textStyle={{ ...GS.textWhite }} style={{ ...GS.bgBlueDark, ...GS.rounded50, ...GS.minw75, ...GS.mh10, ...GS.f1, }} title="Resume Test" onPress={() => closeMenu()} />

				</View>

				<View style={{ ...GS.row100, ...GS.jspacea, ...GS.mt10 }}>
					<SubmitButton textStyle={{ ...GS.textWhite }} style={{ ...GS.bgheadingColor, ...GS.minw75, ...GS.mh10, ...GS.f1, ...GS.mb10 }} title="Submit" onPress={takeReConfirmation} />

				</View>
			</View>
		)
	}

	return (

		<MyContainer navigation={props.navigation} title={testName} padder={false} hideLeftIcon={true} showExamStopIcon={true}
			examStopClickHandler={examStopClickHandler} /*submitMenuRef={submitMenuRef} menuClose={() => closeMenu()}*/ >

			<View style={{ ...GS.row100, ...GS.pv5, ...GS.jspaceb, ...GS.acenter, ...GS.ph20, ...GS.bgLightGreen }}>
				<Bold style={{ ...GS.textWhite }} >Review Summary & Submit</Bold>
				<Menu
					ref={submitMenuRef}
					opened={stickMenu ? true : undefined}
					renderer={SlideInMenu}
					rendererProps={{ anchorStyle: styles.anchorStyle }}
				>
					<MenuTrigger>
						<TouchableWithoutFeedback onPress={showStatsAndSubmit}>
							<MaterialCommunityIcons name="power-standby" size={22} color="white" />
						</TouchableWithoutFeedback>
					</MenuTrigger>
					<MenuOptions customStyles={optionsStyles} >
						<MenuOption onSelect={() => { return false; }}>
							{stickMenu && confirmStage == TestMenuStage.Submit && renderStatistics()}
							{stickMenu && confirmStage == TestMenuStage.ReConfirm && renderSubmitConfirm()}
							{stickMenu && confirmStage == TestMenuStage.Submitted && renderSubmitStatus()}
							{stickMenu && confirmStage == TestMenuStage.Timeout && renderTimeoutStatus()}
						</MenuOption>
					</MenuOptions>
				</Menu>
			</View>

			<View style={{ ...GS.ph20 }}>
				<View style={{ ...GS.row100, ...GS.mt15, ...GS.mb5 }}>
					<View style={{ ...GS.f1, }}>
						<Bold style={{ ...GS.fs24, ...GS.textDarkGray }}>Question {questionNo + 1}/<Text style={GS.fs16}>{questionCount}</Text></Bold>
					</View>

					<View style={{ ...GS.f1, ...GS.aright, ...GS.jcenter }}>
						{
							totalSeconds > 0 &&
							<CountdownTimer totalSeconds={totalSeconds} onTimeFinished={onTimeFinished} requireTimerStop={requireTimerStop} />
						}
					</View>
				</View>

				<View style={styles.progressBar}>
					<View style={{ ...styles.progressIndicator, width: progressPercent }}>
					</View>
				</View>

				{
					currQues != undefined &&
					<>
						<MyWebView html={lang == 1 ? currQues.question_en : currQues.question_hi} />
						{renderOptions()}
					</>
				}
				{
					isAttempted == 1 &&
					<>
						<Bold style={{ ...GS.mt30, ...GS.mb10, ...GS.fs16, ...GS.tcenter , ...GS.textDarkGray }}>
							{lang == 1 ? "How much sure you are about your answer?" : "आप अपने उत्तर को लेकर कितने आश्वस्त हैं?"}
						</Bold>
						<View style={{ ...GS.border, ...GS.borderBlue, ...GS.rounded5, ...GS.row100, ...GS.jspaceb, ...GS.pv2, ...GS.bgWhite, ...GS.shadow, }}>
							<TouchableWithoutFeedback onPress={() => suretyClickHandler(1)}>
								<View style={{
									...GS.f1, ...GS.h40, ...GS.jcenter, ...GS.rounded5, ...GS.acenter,
									...(selectedSurety == 1 ? GS.bgheadingColorLight : GS.bgWhite)
								}}>
									<Bold style={{ ...GS.fs16, ...GS.textSuccess }}>100%</Bold>
								</View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback onPress={() => suretyClickHandler(2)}>
								<View style={{
									...GS.borderLeft, ...GS.borderRight,
									...GS.f1, ...GS.h40, ...GS.jcenter, ...GS.acenter,
									...(selectedSurety == 2 ? GS.bgheadingColorLight : GS.bgWhite)
								}}>
									<Bold style={{ ...GS.fs16, ...GS.textDarkGray }}>50%</Bold>
								</View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback onPress={() => suretyClickHandler(3)}>
								<View style={{
									...GS.f1, ...GS.h40, ...GS.jcenter, ...GS.acenter,
									...(selectedSurety == 3 ? GS.bgheadingColorLight : GS.bgWhite)
								}}>
									<Bold style={{ ...GS.fs16, ...GS.textDanger }}>0%</Bold>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</>
				}

				<MyDialog isVisible={isVisible} hideDialog={() => setIsVisible(false)}
					title="Please select surety"
					style={{ ...GS.rounded10, height: 250, ...GS.bgWhite }}>
					<View style={{ ...GS.h80 }}>
						<Text style={{ ...GS.fs15, ...GS.tcenter ,...GS.textDarkGray }}  >Please select surety to tell us about how much sure you are about your answer </Text>
					</View>
					<View style={{ ...GS.h60 }}>
						<SubmitButton title="Ok" onPress={() => setIsVisible(false)} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgLightGreen, ...GS.minw75, ...GS.f1, ...GS.mb10 }} />
					</View>
				</MyDialog>

				<MyDialog isVisible={isVisibleExamStop} hideDialog={() => setIsVisibleExamStop(false)}
					title=""
					style={{ ...GS.rounded10, height: 250, ...GS.bgheadingColor }}>
					<View style={{ ...GS.h80, ...GS.pt30 }}>
						<Text style={{ ...GS.fs17, ...GS.tcenter, ...GS.textWhite }}  >Are you sure you want to quit {'\n'} from the test?</Text>
					</View>
					<View style={{ ...GS.h60 }}>
						<SubmitButton title="Yes" onPress={testStopped} textStyle={{ ...GS.textWhite }}
							style={{
								...GS.bgheadingColor, ...GS.minw75, ...GS.f1, ...GS.mb10,
								...GS.border3, ...GS.borderWhite
							}} />
					</View>
					<View style={{ ...GS.h60 }}>
						<SubmitButton title="No" onPress={() => setIsVisibleExamStop(false)} textStyle={{ ...GS.textWhite }}
							style={{ ...GS.bgBlueDark, ...GS.minw75, ...GS.f1, ...GS.mb10, ...GS.borderBlueDark, ...GS.border3 }} />
					</View>
				</MyDialog>






				<View style={{ ...GS.row100, ...GS.mt20, ...GS.mb15 }}>
					{
						questionNo > 0 &&
						<View style={{ ...GS.f1, ...GS.aleft }} >
							<CancelButton title="<< Prev" onPress={renderPrevQuestion} disabled={questionNo == 0} style={{ minWidth: 90, backgroundColor: 'none', ...GS.noBorder }} />
						</View>
					}
					{
						questionNo < questionCount - 1 &&
						<View style={{ ...GS.f1, ...GS.aright }}>

							<SubmitButton title="Next >>" onPress={renderNextQuestion} textStyle={{ ...GS.textPrimaryDark }} style={{ minWidth: 90, backgroundColor: 'none', borderColor: 'white', ...GS.noBorder, }} />
						</View>

					}
					{
						questionNo == questionCount - 1 &&
						<SubmitButton title="Submit" onPress={showStatsAndSubmit} textStyle={{ ...GS.textWhite }} style={{ minWidth: 80, ...GS.bgheadingColor, ...GS.minw60, ...GS.mh10, ...GS.f1, ...GS.mb10 }}
						/>
					}
				</View>

			</View>

		</MyContainer >

	)
}

const optionsStyles = {
	optionsContainer: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	}
}
const optionsStyles1 = {
	optionsContainer: {
		backgroundColor: Colors.headingColor,
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

export default StartTestScreen;
