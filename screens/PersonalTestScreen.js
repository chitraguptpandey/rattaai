import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';

import MyContainer from '../components/MyContainer';
import MyPickerInput from '../components/MyPickerInput';
import SubmitButton from '../components/SubmitButton';
import CancelButton from '../components/CancelButton';

import CardView from '../components/CardView';
import { Text, Bold } from '../components/Tags';
import * as GlobalFunctions from '../common/GlobalFunctions';
import GS from '../common/GlobalStyles';
import Colors from '../constants/Colors';
import Variables from '../constants/Variables';
import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

const PersonalTestScreen = props => {

	return (
		<MyContainer navigation={props.navigation} title="Personal Test">

			<View style={{ ...GS.centered }}>
				<Image style={{ width: 350, height: 370, marginBottom: 200 }} source={require('../assets/coming_soon.png')} />
			</View>

		</MyContainer>
	)

}

const styles = StyleSheet.create({
	testHeading: {
		fontSize: 25,
		paddingHorizontal: 20,
		color: Colors.primaryDark,
	}
})

export default PersonalTestScreen;
