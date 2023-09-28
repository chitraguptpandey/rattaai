import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Constants from 'expo-constants';

import { FontAwesome } from '@expo/vector-icons';

import Menu, { MenuTrigger, MenuOptions, MenuOption, renderers } from 'react-native-popup-menu';

import { Text, Bold } from '../components/Tags';
import CardView from '../components/CardView';
import MyContainer from '../components/MyContainer';
import Colors from '../constants/Colors';

import { PieChart } from 'react-native-svg-charts'

import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';

import * as dashboardActions from '../store/actions/dashboard';
import Variables from '../constants/Variables';
import { color } from 'react-native-reanimated';
import MyDialog from '../components/MyDialog';

const { ContextMenu, SlideInMenu, Popover } = renderers;
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const DashboardScreen = props => {

	const appHeaderHeight = 60;
	const maxSummaryHeight = screenHeight - Constants.statusBarHeight - appHeaderHeight - 100;

	const [isLoading, setIsLoading] = useState(true);
	const [studentName, setStudentName] = useState('');
	const [examName, setExamName] = useState('');
	const [batchName, setBatchName] = useState('');
	const [allExams, setAllExams] = useState([]);
	const [stats, setStats] = useState([]);
	const [summaryHeight, setSummaryHeight] = useState(maxSummaryHeight);

	const [chartSeries, setChartSeries] = useState([]);
	const [chartColors, setChartColors] = useState([]);

	const [pieData, setPieData] = useState([]);

	const [testCacheFound, setTestCacheFound] = useState(false);
	const [pendingTestType, setPendingTestType] = useState('Mega');

	const chartWidthAndHeight = 220;

	const menuRef = useRef(null);

	const dispatch = useDispatch();

	const getData = async (examId, batchId) => {
		setIsLoading(true);
		try {
			const apiData = await dispatch(dashboardActions.getData(examId, batchId));
			console.log(apiData)
			setStudentName(apiData.studentName);
			Variables.LoginUser = apiData.studentName;
			setExamName(apiData.examName);
			setBatchName(apiData.batchName);
			setAllExams(apiData.allExams);
			setStats(apiData.stats);

			Variables.ExamId = parseInt(apiData.examId);
			Variables.BatchId = parseInt(apiData.batchId);
			AsyncStorage.setItem('ExamId', Variables.ExamId.toString());
			AsyncStorage.setItem('BatchId', Variables.BatchId.toString());

			const arrChartColors = [ Colors.dashGreen, '#ff6262', Colors.DashYellow];
			let chartColors = [];
			let chartData = [];

			if (apiData.stats.QuestionCounters.TotalCorrect == 0 && apiData.stats.QuestionCounters.TotalIncorrect == 0 && apiData.stats.QuestionCounters.TotalSkipped == 0) {
				chartData.push(100);
				chartColors.push(Colors.gray);
			} else {
				chartData = [apiData.stats.QuestionCounters.TotalCorrect, apiData.stats.QuestionCounters.TotalIncorrect, apiData.stats.QuestionCounters.TotalSkipped];
				chartColors = arrChartColors;
			}


			const strMegaTestCache = await AsyncStorage.getItem('megaTestCache');
			if (strMegaTestCache != undefined && strMegaTestCache != '') {
				const objMegaTestCache = JSON.parse(strMegaTestCache);
				setTestCacheFound(true);
				setPendingTestType(objMegaTestCache.isInstaR == 1 ? 'InstaR' : 'Mega');
			}

			const pd = chartData.map((value, index) => (
				{
					value,
					svg: {
						fill: chartColors[index]
					},
					key: "pie" + index,
				}));

			setPieData(pd);
			setIsLoading(false);
		} catch (err) {
			//setIsLoading(false);
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
	}

	useEffect(() => {
		getData(Variables.ExamId, Variables.BatchId);
	}, [dispatch, props]);


	if (isLoading) {
		return (
			<MyContainer navigation={props.navigation} title="Home" padder={false}>
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primaryDark} />
				</View>
			</MyContainer>
		);
	}


	const examClickHandler = (exam_id, batch_id) => {
		if (testCacheFound) {
			GlobalFunctions.showMessage('Cannot Change Exam', 'You have left 1 ' + pendingTestType + ' Test in middle, Please complete it first');
			menuRef.current.close();
		} else {
			getData(exam_id, batch_id);
		}
	}


	const renderExams = () => {
		let arrItems = [];

		allExams.map((item, index) => {
			arrItems.push(
				<TouchableWithoutFeedback key={index} disabled={Variables.ExamId == parseInt(item.exam_id) && Variables.BatchId == parseInt(item.batch_id)} onPress={() => examClickHandler(item.exam_id, item.batch_id)}>
					<View style={{ ...GS.w100p, ...GS.pt5, ...GS.border, ...GS.mt5, ...(Variables.ExamId == parseInt(item.exam_id) && Variables.BatchId == parseInt(item.batch_id) ? GS.bgDarkGray : GS.bgPrimary) }}>
						<Text style={{ ...GS.pb5, ...GS.ph10 }}>Exam : {item.exam_name}</Text>
						<Text style={{ ...GS.pb5, ...GS.ph10 }}>Batch : {item.batch_name}</Text>
					</View>
				</TouchableWithoutFeedback>)
		});

		return arrItems;
	}

	if (stats == undefined || stats.AverageCounters == undefined || stats.AverageCounters.AvgTillDate == undefined) {
		return (

			<MyContainer navigation={props.navigation} title="Home" padder={false}>
				<View style={GS.centered}>

					<Text>Something went wrong, Please login again.</Text>
				</View>
			</MyContainer>
		);
	}

	return (
		<MyContainer navigation={props.navigation} title="Home" padder={false}>

			<View style={{ ...GS.f1, ...GS.bgWhiteRattaAi }}>

				<Bold style={{ ...GS.ph10, ...GS.mt15, ...GS.fs16, ...GS.textPrimaryDark }}>Welcome {studentName}!</Bold>

				<View style={{ ...GS.row100 }}>
					<View style={{ ...GS.f1, ...GS.pl15 }} >
						<Bold style={{ ...GS.ph10, ...GS.mt2, ...GS.fs14 }}>Exam: </Bold>

					</View>
					<View style={{ ...GS.f4 }}>
						<Text style={{ ...GS.ph10, ...GS.mt2, ...GS.fs14 }}>{examName} </Text>
					</View>
				</View>

				<View style={{ ...GS.row100 }}>
					<View style={{ ...GS.f1, ...GS.pl15 }} >
						<Bold style={{ ...GS.ph10, ...GS.mt2, ...GS.fs14 }}>Batch: </Bold>

					</View>
					<View style={{ ...GS.f4 }}>
						<Text style={{ ...GS.ph10, ...GS.mt2, ...GS.fs14 }}>{batchName}</Text>
					</View>
				</View>

				{
					allExams.length > 1 &&
					<Menu
						ref={menuRef}
						renderer={SlideInMenu}
						rendererProps={{ anchorStyle: styles.anchorStyle }}
					>
						<MenuTrigger>
							<Bold style={{ ...GS.textDanger, ...GS.pv5, ...GS.fs15, ...GS.ph10, ...GS.tcenter }}>Change Exam</Bold>
						</MenuTrigger>
						<MenuOptions customStyles={optionsStyles} >
							<MenuOption onSelect={() => { return false; }}>
								<ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: summaryHeight }}>
									<TouchableWithoutFeedback>
										<View style={{ ...GS.ph15, ...GS.pv15 }}>
											{renderExams()}
										</View>
									</TouchableWithoutFeedback>
								</ScrollView>
							</MenuOption>
						</MenuOptions>
					</Menu>
				}

				{/* #85d98e */}
				<CardView style={{ ...GS.p10, ...GS.acenter, backgroundColor: Colors.skyBlue, ...GS.pb25 }}>
					<Text style={{ ...GS.mv2, ...GS.fs15, color: '#000' }}>My Performance</Text>
					<Bold style={{ ...GS.textdark, ...GS.mt2, ...GS.mb10, ...GS.fs14 }}>AVG QUESTIONS PRACTICED PER DAY</Bold>
					<View style={{ ...GS.row100, ...GS.jspacea, ...GS.acenter }}>
						<View style={{ ...GS.acenter, ...GS.rounded50, backgroundColor: Colors.dashGreen, ...GS.f1, ...GS.mr10, ...GS.p5 }}>
							<Text style={{ ...GS.textWhite, ...GS.tcenter }}>{stats.AverageCounters.AvgTillDate}</Text>
							<Text style={GS.textWhite}>Till Date</Text>
						</View>
						<View style={{ ...GS.acenter, ...GS.rounded50, backgroundColor: Colors.dashGreen, ...GS.f1, ...GS.mr10, ...GS.p5 }}>
							<Text style={GS.textWhite}>{stats.AverageCounters.AvgLast7Days}</Text>
							<Text style={GS.textWhite}>7 Days</Text>
						</View>
						<View style={{ ...GS.acenter, ...GS.rounded50, backgroundColor: Colors.dashGreen, ...GS.f1, ...GS.p5 }}>
							<Text style={{ ...GS.textWhite, ...GS.tcenter }}>{stats.AverageCounters.AvgLast15Days}</Text>
							<Text style={GS.textWhite}>15 Days</Text>
						</View>

					</View>

				</CardView>



				<View style={{ ...GS.row100, marginTop: 30 }}>
					<View style={{ ...GS.row100, ...GS.jcenter, ...GS.acenter, ...GS.rounded50, backgroundColor: "#F5F6FD", ...GS.f1, ...GS.m10, ...GS.p8, ...GS.shadow }}>
						<View style={{ ...GS.f1, ...GS.acenter, ...GS.pl5 }} >
							<FontAwesome name="circle" size={20} color={Colors.dashGreen} />
						</View>
						<View style={{ ...GS.f4, ...GS.acenter }}>
							<Text style={styles.statsText}>CORRECT</Text>
							<Text style={{ ...GS.textDashGreen, ...GS.fs18, ...GS.tex }}>{stats.QuestionCounters.TotalCorrect}</Text>
						</View>
					</View>


					<View style={{ ...GS.row100, ...GS.jcenter, ...GS.acenter, ...GS.rounded50, backgroundColor: '#F5F6FD', ...GS.f1, ...GS.m10, ...GS.p8, ...GS.shadow }} >
						<View style={{ ...GS.f1, ...GS.acenter, ...GS.pl1 }} >
							<FontAwesome name="circle" size={20} color="#ff6262" />
						</View>
						<View style={{ ...GS.f4, ...GS.acenter }}>
							<Text style={styles.statsText}>INCORRECT</Text>
							<Text style={{ ...GS.textDanger, ...GS.fs18 }} >{stats.QuestionCounters.TotalIncorrect}</Text>
						</View>
					</View>


					<View style={{ ...GS.row100, ...GS.jcenter, ...GS.acenter, ...GS.rounded50, backgroundColor: '#F5F6FD', ...GS.f1, ...GS.m10, ...GS.p8, ...GS.shadow }}>
						<View style={{ ...GS.f1, ...GS.acenter, ...GS.pl5 }} >
							<FontAwesome name="circle" size={20} color={Colors.DashYellow} />

						</View>
						<View style={{ ...GS.f4, ...GS.acenter }}>
							<Text style={{ ...styles.statsText }}>LEFT</Text>
							<Text style={{ ...GS.textWarning, ...GS.fs18 }}>{stats.QuestionCounters.TotalSkipped}</Text>

						</View>

					</View>
				</View>

				<View style={GS.row100}>
				</View>



				<CardView style={styles.progressContainer}>
					<Bold style={styles.practiceText}>Total Question Practiced</Bold>
					<View style={{ ...GS.row100, ...GS.mb10 }}>
						<View style={GS.f1}>
							<Text style={{ ...GS.mt15, ...GS.fs17, ...GS.tcenter, ...GS.sleft }}>Today{"\n" + stats.PerformanceCounters.BackDay0Stats.TotalAttempted}</Text>
						</View>
						<View style={GS.f1}>
							<Text style={{ ...GS.mt15, ...GS.fs17, ...GS.tcenter, ...GS.sright }}>Yesterday{"\n" + stats.PerformanceCounters.BackDay1Stats.TotalAttempted}</Text>
						</View>
					</View>

					<View style={{ ...GS.w100p, ...GS.h250, ...GS.acenter }}>
						<View style={styles.pieCenterTextView}>
							<Text style={{ fontSize: 40 }}>{stats.QuestionCounters.TotalQuestions}</Text>
							<Text style={{ fontSize: 17, marginTop: -10 }}>Questions</Text>
						</View>
						<PieChart style={{ height: chartWidthAndHeight, width: chartWidthAndHeight, ...GS.mb15 }} data={pieData} padAngle={0} innerRadius="60%" />
					</View>



				</CardView>

				<View>
					<CardView style={{ ...GS.w300, ...GS.h60, ...GS.ml10, ...GS.jcenter, ...GS.pb10, ...GS.scenter, ...GS.bgBlueDark }}>
						<TouchableWithoutFeedback onPress={() => GlobalFunctions.navigate(props, 'MegaTest')}>
							<View style={{ ...GS.row100, ...GS.jcenter, ...GS.acenter }}>
								<View style={{ ...GS.f1, ...GS.pl50 }}>
									<Image source={require('../assets/icon_list2.png')} style={{ ...GS.w35, ...GS.h35 }} />
								</View>
								<Text style={{ ...GS.fs18, ...GS.pr80, ...GS.textWhite }}>Mega Test</Text>
							</View>
						</TouchableWithoutFeedback>
					</CardView>
					<CardView style={{ ...GS.w300, ...GS.h60, ...GS.ml10, ...GS.jcenter, ...GS.pb10, ...GS.scenter, ...GS.bgLightGreen }}>
						<TouchableWithoutFeedback onPress={() => GlobalFunctions.navigate(props, 'OpenTest')}>
							<View style={{ ...GS.row100, ...GS.jspacea, ...GS.jcenter, ...GS.acenter }}>
								<View style={{ ...GS.f1, ...GS.pl50 }}>
									<Image source={require('../assets/icon_list2.png')} style={{ ...GS.w35, ...GS.h35 }} />
								</View>

								<Text style={{ ...GS.fs18, ...GS.pr80, ...GS.textWhite }}>One Test</Text>

							</View>
						</TouchableWithoutFeedback>
					</CardView>


					{/* <CardView style={{ ...GS.w300, ...GS.h60, ...GS.ml10, ...GS.jcenter, ...GS.pb10, ...GS.scenter }}>
						<TouchableWithoutFeedback onPress={() => GlobalFunctions.navigate(props, 'SpecialOpenTest')}>
							<View style={{ ...GS.row100, ...GS.acenter }}>
								<View style={{ ...GS.f1, ...GS.pl50 }}>
									<Image source={require('../assets/list_icon.png')} style={{ ...GS.w35, ...GS.h35 }} />
								</View>
								<Text style={{ ...GS.fs18, ...GS.pr20 }}>Special One Test</Text>

							</View>
						</TouchableWithoutFeedback>
					</CardView> */}
				</View>



			</View>

		</MyContainer>
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
	welcome: {
		width: '100%',
		paddingTop: 10,
		paddingBottom: 15,
		paddingHorizontal: 15,
		backgroundColor: Colors.white
	},
	pieCenterTextView: {
		position: 'absolute',
		zIndex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 220,
	},
	practiceText: {
		fontSize: 17,
		color: Colors.black,
		paddingHorizontal: 20,
		marginTop: 20,
	},
	progressContainer: {
		marginTop: 10,
		paddingTop: 5,
		paddingBottom: 10,
		marginHorizontal: 20,
		alignItems: 'center',
		backgroundColor: '#F5F6FD'
	},
	statsText: {
		fontSize: 12,
		marginTop: 3,
		color: Colors.lightBlack,
		textAlign: 'center',
	},
	statsFigure: {
		flex: 1,
		textAlign: 'center',
		paddingBottom: 3,
		fontSize: 22,
		color: Colors.primaryDark
	}
})

export default DashboardScreen;
