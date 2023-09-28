import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import SubmitButton from '../components/SubmitButton';
import ProgressCircle from 'react-native-progress-circle';
import * as ExpoIconType from '@expo/vector-icons';

import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

import { Text, Bold } from '../components/Tags';
import MyContainer from '../components/MyContainer';
import CardView from '../components/CardView';
import MyTextInput from '../components/MyTextInput';
import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';
import Colors from '../constants/Colors';
import Variables from '../constants/Variables';

import * as testActions from '../store/actions/test';

const RemedialTest = props => {

	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formValues, setFormValues] = useState({});
	const [formErrors, setFormErrors] = useState({});
	const [formRefs, setFormRefs] = useState({});

	const [tests, setTests] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [isFiltering, setIsFiltering] = useState(false);

	const [testCacheFound, setTestCacheFound] = useState(false);
	const [cacheTestId, setCacheTestId] = useState(0);

	const dispatch = useDispatch();

	const getData = async () => {
		setIsLoading(true);
		try {

			const apiData = await dispatch(testActions.getList(Variables.ExamId, Variables.BatchId, false, 1));
			setTests(apiData);

			const strMegaTestCache = await AsyncStorage.getItem('megaTestCache');
			if (strMegaTestCache != undefined && strMegaTestCache != '') {
				const objMegaTestCache = JSON.parse(strMegaTestCache);
				setTestCacheFound(true);
				if (objMegaTestCache.isInstaR == 0) {
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

	const textinfo = (item) => {
		console.log(item)
		GlobalFunctions.showMessage('Instruction', item.instructions)
	}


	useEffect(() => {
		getData();
	}, [dispatch, props]);


	const openTest = (test) => {
		GlobalFunctions.navigate(props, 'RemedialTestInstruction', { testId: test.id, testName: test.name, instructions: test.instructions, duration: test.duration });
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

	const renderTestCard = () => {
		let arrItems = [];

		let filteredTests = [];

		if (testCacheFound) {
			filteredTests = tests.filter(x => x.id.toString() == cacheTestId.toString());
		} else {
			filteredTests = searchText.length == 0 ? tests : tests.filter(x => x.name.toLowerCase().indexOf(searchText.toLowerCase(), 0) > -1);
		}

		filteredTests.map((item, index) => {
			arrItems.push(
				<View key={index}>
					<CardView style={styles.testContainer}>

						<View style={{ ...GS.row100 }}>
							<View style={{ ...GS.f1, ...GS.row }}>
								<View style={{ ...GS.mh5 }}>
									<Image source={require('../assets/megatest.png')} />
								</View>

								<View style={{...GS.m10}}>


									<Text style={{ ...GS.fs14, ...GS.textDarkGray }}>{item.question_ids.split(',').length} QUESTIONS</Text>

									<Bold numberOfLines={1} style={{ ...GS.fs16, ...GS.mb5 }}>
										{item.name}
									</Bold>
									<Text style={{ ...GS.textPrimaryDark, ...GS.fs15 }}>{item.test_date}</Text>
								</View>
							</View>
							<View style={{ ...GS.f1, ...GS.aright }}>

								<Text style={{ ...GS.fs14, ...GS.textDarkGray }}>TOTAL MS: {item.total_marks}</Text>
								<View style={{ ...GS.row100,...GS.jright,...GS.mt15 }}>
									<FontAwesome5 name="info-circle" size={24} color="#1974D2" onPress={() => textinfo(item)} />

									<View style={{ ...GS.bgPrimary, ...GS.rounded20, ...GS.ph15, ...GS.h20, ...GS.jcenter, ...(item.test_date != "" ? GS.ml10 : undefined) }}>
										<Bold style={{ ...GS.textBlack, ...GS.fs12 }}>{item.id}</Bold>
									</View>
								</View>
							</View>
						</View>


						{/* <View style={{ ...GS.f1, ...GS.row100  }}>
							<View style={{ ...GS.f1, }}>
								<Image />

							</View>
							<View style={{ ...GS.f1, }}>
								<Bold numberOfLines={1} style={{ ...GS.fs18, ...GS.mb5 }}>
									{item.name}
								</Bold>
								<Text style={{ ...GS.textPrimaryDark, ...GS.fs15 }}>{item.test_date}</Text>

							</View>

						</View>

						<View style={{ ...GS.f1,  }}>
							<Text style={{ ...GS.fs14, ...GS.textDarkGray }}>TOTAL MARKS: {item.total_marks}</Text>
							<FontAwesome5 name="info-circle" size={24} color="#1974D2" onPress={() => textinfo(item)} />
						</View>

						{/* <View style={{ ...GS.row100, ...GS.jspaceb, ...GS.mb5 }}>
							<Text style={{ ...GS.fs14, ...GS.textDarkGray }}>{item.question_ids.split(',').length} QUESTIONS</Text>
							<Text style={{ ...GS.fs14, ...GS.textDarkGray }}>TOTAL MARKS: {item.total_marks}</Text>
							<FontAwesome5 name="info-circle" size={24} color="#1974D2" onPress={() => textinfo(item)} />

						</View>
						<View style={GS.row100}>
							<View style={{ flex: 2, paddingRight: 5 }}>
								<Bold numberOfLines={1} style={{ ...GS.fs18, ...GS.mb5 }}>
									{item.name}
								</Bold>
								<View style={{ ...GS.row100, ...GS.pv2 }}>
									<Text style={{ ...GS.textPrimaryDark, ...GS.fs15 }}>{item.test_date}</Text>
									<View style={{ ...GS.bgPrimary, ...GS.rounded20, ...GS.ph15, ...GS.h20, ...GS.jcenter, ...(item.test_date != "" ? GS.ml10 : undefined) }}>
										<Bold style={{ ...GS.textBlack, ...GS.fs12 }}>{item.id}</Bold>
									</View>
								</View>
							</View>

						</View> */}
					</CardView>
					<View style={{ flex: 1.2, alignItems: 'flex-end', marginTop: -30, ...GS.mr20 }}>
						<SubmitButton title="Start Test" onPress={() => openTest(item)} style={{ ...GS.h30, ...GS.minw100, ...GS.rounded20, backgroundColor: "#1974D2" }}
							textStyle={{ ...GS.fs14, ...GS.textWhite }} />
					</View>
				</View>
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


	if (isLoading) {
		return (
			<MyContainer navigation={props.navigation} title="Remedial Test">
				<View style={GS.centered}>
					<ActivityIndicator size="large" color={Colors.primaryDark} />
				</View>
			</MyContainer>
		);
	}

	return (
		<MyContainer navigation={props.navigation} title="Remedial Test" stickyHeaderIndices={tests.length > 3 ? [0] : undefined} padder={false}>

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
										You have left {cacheTestId == 0 ? "InstaR" : "following"} test in middle{"\n"}
										Please complete it first.{"\n"}
										Then you can see other tests (if exists)
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
					<View style={GS.centered}>
						<Image source={require('../assets/no_record_found.png')} />
					</View>
			}
		</MyContainer>
	)
}

const styles = StyleSheet.create({
	testContainer: {
		marginBottom: 15,
		paddingHorizontal: 10,
		paddingVertical: 10,
		marginHorizontal: 0
	},
	statsText: {
		color: Colors.lightBlack,
	}
})

export default RemedialTest;
