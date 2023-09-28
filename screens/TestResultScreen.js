import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch } from 'react-redux';

import ProgressCircle from 'react-native-progress-circle';
import * as ExpoIconType from '@expo/vector-icons';

import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

import { Text, Bold } from '../components/Tags';
import MyContainer from '../components/MyContainer';
import CardView from '../components/CardView';
import MyTextInput from '../components/MyTextInput';
import * as GlobalFunctions from '../common/GlobalFunctions';
import GS from '../common/GlobalStyles';
import Colors from '../constants/Colors';

import * as testActions from '../store/actions/test';
import Variables from '../constants/Variables';

const TestResultScreen = props => {

	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isFiltering, setIsFiltering] = useState(false);

	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	const [tests, setTests] = useState();
	const [searchText, setSearchText] = useState('');

	const [testCacheFound, setTestCacheFound] = useState(false);
	const [cacheTestId, setCacheTestId] = useState(0);

	const dispatch = useDispatch();

	const getData = async () => {
		setIsLoading(true);
		try {
			const apiData = await dispatch(testActions.getList(Variables.ExamId, Variables.BatchId, true));
			setTests(apiData);

			const strMegaTestCache = await AsyncStorage.getItem('megaTestCache');
			if (strMegaTestCache != undefined && strMegaTestCache != '') {
				const objMegaTestCache = JSON.parse(strMegaTestCache);
				setTestCacheFound(true);
				if (objMegaTestCache.isInstaR == 1) {
					const resTest = apiData.filter(x => x.id == objMegaTestCache.testId);
					if (resTest.length > 0) {
						setCacheTestId(objMegaTestCache.testId);
					} else {
						GlobalFunctions.showMessage('Test Missing', 'The test you have left in middle is no longer availabble now');
						AsyncStorage.setItem('megaTestCache', '');
					}
				}
			}

			setIsLoading(false);
		} catch (err) {
			//setIsLoading(false);
			GlobalFunctions.showMessage('An Error Occurred!', err.message);
		}
	}

	useEffect(() => {
		getData();
	}, [dispatch, props]);


	if (isLoading) {
		return (
			<MyContainer navigation={props.navigation} title="Test Result">
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primaryDark} />
				</View>
			</MyContainer>
		);
	}

	const changeSearchText = text => {
		setIsFiltering(true);

		if (Variables.MyTimer != null) {
			clearTimeout(Variables.MyTimer);
		}

		Variables.MyTimer = setTimeout(() => {
			setSearchText(text);
			clearTimeout(Variables.MyTimer);
			Variables.MyTimer = setTimeout(() => {
				setIsFiltering(false);
				clearTimeout(Variables.MyTimer);
			}, 300);
		}, 600);
	}

	const instaRClickHandler = (test) => {
		//GlobalFunctions.showConfirmation('Start Insta-R Test ?', 'Do you want to start Inta-R test ?', startInstaR, test);
		GlobalFunctions.showInstaRConfirmation(props, test.id, test.test_name, test.total_marks, 2, true);
	}

	// const startInstaR = (test) => {
	// 	GlobalFunctions.navigate(props, 'StartTest', { testId: test.id, langId: 2, testName: test.test_name, instaR: 1 });
	// }

	const openTest = (test) => {
		GlobalFunctions.navigate(props, 'ResultView', { testId: test.id, langId: 2, testName: test.test_name, totalMarks: test.total_marks });
	}

	const clearCacheClickHandler = () => {
		GlobalFunctions.showConfirmation('Clear Cache ?', 'Are you sure you want to clear in-memory answers you have marked earlier ?', clearCache);
	}

	const clearCache = () => {
		AsyncStorage.setItem('megaTestCache', '');
		setIsLoading(true);
		setTestCacheFound(false);
		setCacheTestId(0);
		setTimeout(() => {
			getData();
		}, 100);
	}

	const renderTestCard = () => {
		let arrItems = [];

		let filteredTests = [];

		if (testCacheFound) {
			filteredTests = tests.filter(x => x.id == cacheTestId);
		} else {
			filteredTests = searchText.length == 0 ? tests : tests.filter(x => x.test_name.toLowerCase().includes(searchText.toLowerCase()));
		}

		filteredTests.map((item, index) => {
			arrItems.push(
				<TouchableWithoutFeedback key={index} onPress={() => openTest(item)}>
					<View>
						<CardView style={styles.testContainer}>
							<View style={{ ...GS.row100, ...GS.jspaceb, ...GS.mb5 }}>
								<Text style={{ ...GS.fs14, ...GS.textDarkGray }}>{item.question_ids.split(',').length} QUESTIONS</Text>
								{
									item.instar_status == "2" &&
									<TouchableWithoutFeedback onPress={() => instaRClickHandler(item)}>
										<View style={{ ...GS.bgWarning, ...GS.p5, ...GS.w35, ...GS.h35, ...GS.rounded35, ...GS.jcenter, ...GS.acenter }}>
											<Bold>IR</Bold>
										</View>
									</TouchableWithoutFeedback>
								}
								<Text style={{ ...GS.fs14, ...GS.textDarkGray }}>TOTAL MARKS: {item.total_marks}</Text>
							</View>
							<View style={GS.row100}>
								<View style={{ flex: 2.5, paddingRight: 5 }}>
									<Bold numberOfLines={1} style={{ fontSize: 18 }}>
										{item.test_name}
									</Bold>
									<View style={{ ...GS.row100 }}>
										<Text style={{ ...GS.pv2, ...GS.fs15, color: Colors.darkGray }}>Score: {item.score}</Text>
										{
											item.instar_status == "1" &&
											<Text style={{ ...GS.pv2, ...GS.fs15, ...GS.ml15, color: Colors.darkGray }}>IR Score: {item.instar_score}</Text>
										}
									</View>
									<View style={{ ...GS.row100, ...GS.pv2 }}>
										<Text style={{ ...GS.textPrimaryDark, ...GS.fs15 }}>{item.test_date}</Text>
										<View style={{ ...GS.bgPrimary, ...GS.rounded20, ...GS.ph15, ...GS.h20, ...GS.jcenter, ...(item.test_date != "" ? GS.ml10 : undefined) }}>
											<Bold style={{ ...GS.textBlack, ...GS.fs12 }}>{item.id}</Bold>
										</View>
									</View>
								</View>
								<View style={{ flex: 1, alignItems: 'flex-end' }}>
									<ProgressCircle
										percent={item.score_percent == "NA" ? 0 : parseInt(item.score_percent)}
										radius={35}
										borderWidth={6}
										color={Colors.progressBarColor}
										shadowColor={Colors.progressBgColor}
										bgColor={Colors.white}
									>
										<Text style={{ fontSize: 20 }}>{item.score_percent == "NA" ? "NA" : item.score_percent + "%"}</Text>
									</ProgressCircle>
								</View>
							</View>
							<View style={{ ...GS.row100, ...GS.mt5, justifyContent: 'space-between' }}>
								<Bold style={styles.statsText}>Attempted: {item.attempted}</Bold>
								<Bold style={styles.statsText}>Correct: {item.correct}</Bold>
								<Bold style={styles.statsText}>Accuracy: {item.accuracy == "NA" ? "NA" : item.accuracy + "%"}</Bold>
							</View>
						</CardView>
					</View>
				</TouchableWithoutFeedback>
			)
		})

		if (tests.length > 0 && arrItems.length == 0 && !testCacheFound) {
			arrItems.push(
				<View key="ntf" style={{ ...GS.acenter, ...GS.mt20 }}>
					<Bold>No Test Found</Bold>
				</View>
			)
		}

		return arrItems;
	}

	return (
		<MyContainer navigation={props.navigation} title="Test Result" stickyHeaderIndices={tests.length > 3 ? [0] : undefined} padder={false}>

			{
				tests.length > 3 &&
				<View style={{ ...GS.w100p, ...GS.h55, ...GS.pt5, ...GS.mb5, ...GS.ph10, ...GS.bgWhite, ...GS.roundedBottom10, elevation: 6 }}>
					<MyTextInput name="name" value={formValues} error={formErrors} submitting={isSubmitting}
						initialValue={formValues['name']} showLabel={false} placeholder="Search test by name..."
						keyboardType={KeyboardType.Default} autoCapitalize={CapitalizeType.None} refs={formRefs}
						returnKeyType="done" iconType={ExpoIconType.Ionicons} iconName="search-outline"
						textInputStyle={{ ...GS.mt0 }} iconStyle={{ ...GS.t10 }}
						onChangeText={changeSearchText} />
				</View>
			}

			{
				tests.length > 0 ?
					isFiltering ?
						<View style={GS.centered}>
							<ActivityIndicator size="large" color={Colors.primaryDark} />
						</View>
						:
						<View style={{ ...GS.ph10 }}>
							{
								testCacheFound &&
								<View style={{ ...GS.w100p, ...GS.pv10 }}>
									<Bold style={{ ...GS.tcenter, ...GS.textDanger, ...GS.lh22 }}>
										You have left {cacheTestId == 0 ? "MegaTest" : "following"} test in middle{"\n"}
										Please complete it first.{"\n"}
										Then you can see test results (if exists)
									</Bold>
								</View>
							}
							{renderTestCard()}
							{
								testCacheFound &&
								<TouchableWithoutFeedback onPress={clearCacheClickHandler}>
									<View style={{ ...GS.ph10, ...GS.pv5, ...GS.mt10, ...GS.rounded5, ...GS.acenter, ...GS.bgWarning, ...GS.scenter }}>
										<Text>Clear Cache</Text>
									</View>
								</TouchableWithoutFeedback>
							}
						</View>
					:
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Image source={require('../assets/no_record_found.png')} />
					</View>
			}
		</MyContainer>
	)
}

const styles = StyleSheet.create({
	testContainer: {
		marginBottom: 15,
		paddingVertical: 10
	},
	statsText: {
		color: Colors.lightBlack,
	}
})

export default TestResultScreen;
