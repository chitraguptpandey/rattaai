import React, { useState, useEffect } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, Bold } from './Tags';
import MyIcon from './MyIcon';

import GS from '../common/GlobalStyles';
import Colors from '../constants/Colors';
import { ValidationType } from '../constants/Enums';

const MyTextInput = props => {

	const [inputValue, setInputValue] = useState(props.initialValue);
	const [inputError, setInputError] = useState('');
	const [inputRef, setInputRef] = useState();
	const [isPasswordType, setIsPasswordType] = useState(props.name.indexOf('password', 0) > -1);
	const [showPassword, setShowPassword] = useState(false);

	const setControlRef = ref => {
		setInputRef(ref);
		if (props.refs) {
			props.refs[props.name] = ref;
		}
	}

	useEffect(() => {
		if (props.initialValue != undefined) { //&& props.initialValue != ''
			setInputValue(props.initialValue);
			props.value[props.name] = props.initialValue;
		}
		if (props.submitting) {
			validateInput(inputValue);
		}
		if (props.editable != undefined && !props.editable) {
			validateInput(props.initialValue);
		}
		if (props.resetting) {
			setInputValue('');
			props.value[props.name] = '';
		}
	}, [props])

	const validateInput = enteredText => {
		if (props.validationType == ValidationType.Required) {
			if (enteredText == '' || enteredText == undefined) {
				setInputError('This field is required');
				props.error[props.name] = 'This field is required';
			} else {
				setInputError('');
				props.error[props.name] = '';
			}
		}
		else if (enteredText != '' && enteredText != undefined && (props.validationType == ValidationType.Email || props.validationType == ValidationType.EmailRequired)) {
			const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!emailRegex.test(enteredText.toLowerCase())) {
				setInputError('Enter valid email');
				props.error[props.name] = 'Enter valid email';
			} else {
				setInputError('');
				props.error[props.name] = '';
			}
		}
		else if (props.validationType == ValidationType.EmailRequired) {
			if (enteredText == '' || enteredText == undefined) {
				setInputError('This field is required');
				props.error[props.name] = 'This field is required';
			} else {
				setInputError('');
				props.error[props.name] = '';
			}
		}
		else if (enteredText != '' && enteredText != undefined && (props.validationType == ValidationType.Mobile || props.validationType == ValidationType.MobileRequired)) {
			const mobileRegex = /^[0-9]{10}$/g;
			if (!mobileRegex.test(enteredText.toLowerCase())) {
				setInputError('Enter valid mobile');
				props.error[props.name] = 'Enter valid mobile';
			} else {
				setInputError('');
				props.error[props.name] = '';
			}
		}
		else if (props.validationType == ValidationType.MobileRequired) {
			if (enteredText == '' || enteredText == undefined) {
				setInputError('This field is required');
				props.error[props.name] = 'This field is required';
			} else {
				setInputError('');
				props.error[props.name] = '';
			}
		}
		else if (enteredText != '' && enteredText != '0' && enteredText != undefined && (props.validationType == ValidationType.Number || props.validationType == ValidationType.NumberRequired)) {
			const numberRegex = /^\d+$/;
			if (!numberRegex.test(enteredText.toLowerCase())) {
				setInputError('Enter valid input');
				props.error[props.name] = 'Enter valid input';
			} else {
				setInputError('');
				props.error[props.name] = '';
			}
		}
		else if (props.validationType == ValidationType.NumberRequired) {
			if (enteredText == '' || enteredText == '0' || enteredText == undefined) {
				setInputError('This field is required');
				props.error[props.name] = 'This field is required';
			} else {
				setInputError('');
				props.error[props.name] = '';
			}
		}
		else if (enteredText != '' && enteredText != '0' && enteredText != undefined && (props.validationType == ValidationType.Decimal || props.validationType == ValidationType.DecimalRequired)) {
			const decimalRegex = /^\d+(\.\d{1,2})?$/;
			if (!decimalRegex.test(enteredText.toLowerCase())) {
				setInputError('Enter valid input');
				props.error[props.name] = 'Enter valid input';
			} else {
				setInputError('');
				props.error[props.name] = '';
			}
		}
		else if (props.validationType == ValidationType.DecimalRequired) {
			if (enteredText == '' || enteredText == undefined) {
				setInputError('This field is required');
				props.error[props.name] = 'This field is required';
			} else {
				setInputError('');
				props.error[props.name] = '';
			}
		}
		else {
			setInputError('');
			props.error[props.name] = '';
		}

		if (props.minLength != undefined && enteredText != undefined && enteredText.trim().length < props.minLength) {
			setInputError('Enter valid input');
			props.error[props.name] = 'Enter valid input';
		}
	}

	const textChangeHandler = text => {
		setInputValue(text);
		props.value[props.name] = text;
		validateInput(text);
		if (props.onChangeText) {
			props.onChangeText(text);
		}
	}

	const moveToNextCtl = () => {
		if (props.nextCtl && props.refs) {
			props.refs[props.nextCtl].focus();
		}
	}

	const textPressIn = () => {
		if (inputRef.isFocused() && Keyboard['_currentlyShowing'] == null) {
			Keyboard.dismiss();
			setTimeout(() => {
				inputRef.focus();
			}, 10);
		}
	}

	return (
		<View style={GS.controlContainer}>
			{
				(props.showLabel === true) &&
				<View style={GS.title_and_error}>
					<Bold style={{ ...GS.label,...props.lebelStyle, ...(inputError == undefined || inputError == '' ? GS.labelValid : GS.labelInvalid) }}>
						{props.label}
					</Bold>
					<Text style={GS.errorMessage}>
						{inputError}
					</Text>
				</View>
			}
			<TextInput
				{...props}
				style={{
					...(props.multiline ? styles.multiline : styles.input),
					...(inputError == undefined || inputError == '' ? GS.inputValid : GS.inputInvalid),
					minHeight: (props.multiline && props.numberOfLines ? 27 * props.numberOfLines : 35),
					backgroundColor: props.editable != undefined && props.editable === false ? Colors.gray : Colors.txtBoxBgColor,
					marginTop: props.showLabel === true ? 0 : 15,
					paddingLeft: props.iconType == undefined ? 10 : 45,
					...props.textInputStyle
				}}
				placeholder={props.placeholder}
				onChangeText={textChangeHandler}
				onPressIn={textPressIn}
				secureTextEntry={isPasswordType && !showPassword}
				value={inputValue}
				editable={props.editable != undefined ? props.editable : !props.submitting}
				returnKeyType={props.returnKeyType != undefined ? props.returnKeyType : (props.nextCtl == undefined ? "done" : "next")}
				ref={ref => setControlRef(ref)}
				blurOnSubmit={!props.multiline && props.nextCtl == undefined}
				onSubmitEditing={moveToNextCtl}
			/>
			{
				props.iconType &&
				<MyIcon iconType={props.iconType} name={props.iconName} style={{ ...styles.leftIcon, ...props.iconStyle }} size={props.iconSize}
					color={props.editable === false ? Colors.iconBlackColor : undefined} />
			}
			{
				isPasswordType &&
				<View style={styles.passwordEye}>
					<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
						<MaterialCommunityIcons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="black" />
					</TouchableOpacity>
				</View>
			}
		</View>
	)

}

const styles = StyleSheet.create({
	input: {
		paddingVertical: 7,
		//paddingLeft: 45,
		paddingRight: 10,
		minHeight: 35,
		fontSize: 15.5
	},
	multiline: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		textAlignVertical: 'top',
		fontSize: 15.5,
		lineHeight: 25,
	},
	passwordEye: {
		position: 'absolute',
		right: 5,
		top: 22,
		paddingRight: 10,
		paddingLeft: 30,
		paddingVertical: 5,
	},
	leftIcon: {
		position: 'absolute',
		top: 25,
		left: 8,
	}
})

export default MyTextInput;
