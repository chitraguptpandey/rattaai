import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';

import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { Text, Bold } from '../components/Tags';

import Colors from '../constants/Colors';
import * as GlobalFunctions from '../common/GlobalFunctions';
import GS from '../common/GlobalStyles';

const AppHeader = props => {

	const userData = useSelector(state => state.login);

	const iconClickHandler = () => {
		if (props.showBackIcon) {
			props.onBackPress();
		} else {
			props.navigation.toggleDrawer();
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.leftContainer}>
				{
					!props.hideLeftIcon &&
					<TouchableOpacity onPress={iconClickHandler}>
						<View style={styles.leftIcon}>
							{
								props.showBackIcon ?
									<Ionicons name="ios-arrow-back" color={Colors.white} size={24} /> :
									<Ionicons name="ios-menu" color={Colors.white} size={24} />
							}
						</View>
					</TouchableOpacity>
				}
				<View style={{ ...styles.textArea, paddingLeft: props.hideLeftIcon ? 15 : 0 }}>
					<Bold numberOfLines={2} style={{ ...styles.headerText, lineHeight: 28 }}>{props.title}</Bold>
				</View>
			</View>

			<View style={styles.rightContainer}>
				{
					(props.showBackIcon == undefined || props.showBackIcon === false) && !props.showExamStopIcon &&
					<>
						{/* <View style={{ ...styles.rightIcon, borderBottomColor: props.highlightNotificationIcon ? Colors.primaryDark : Colors.primaryLight }}>
                            <TouchableOpacity onPress={() => { GlobalFunctions.navigate(props, 'Notifications') }}>
                                {
                                    (props.highlightNotificationIcon == undefined || props.highlightNotificationIcon === false) &&
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>5</Text>
                                    </View>
                                }
                                <FontAwesome5 name="bell" color={Colors.primaryDark} size={24} />
                            </TouchableOpacity>
                        </View> */}
						<View style={{ ...styles.rightIcon, borderBottomColor: Colors.headingColor }}>
							<TouchableOpacity onPress={() => { GlobalFunctions.navigate(props, 'Profile') }}>
								{/* <ImageBackground style={styles.profileIcon} source={require('../assets/no_image_available.png')}> */}
								{
									userData.ProfilePic != undefined && userData.ProfilePic != '' ?
										<Image source={{ uri: GlobalFunctions.getProfileImageUri(userData.ProfilePic) }} style={styles.profileIcon} /> :
										<Image source={require('../assets/no_image_available.png')} style={styles.profileIcon} />
								}
								{/* </ImageBackground> */}
							</TouchableOpacity>
						</View>
					</>
				}
				{
					props.showInstaRIcon &&
					<View style={{ ...styles.rightIcon, borderBottomColor: Colors.headingColor }}>
						<TouchableOpacity onPress={props.instaRClickHandler}>
							<View style={{ ...GS.bgWarning, ...GS.border, ...GS.jcenter, ...GS.acenter, width: 30, height: 23, borderWidth: 2 }}>
								<Bold>IR</Bold>
							</View>
						</TouchableOpacity>
					</View>
				}
				{
					props.showExamStopIcon &&
					<View style={{ ...styles.rightIcon, borderBottomColor: Colors.headingColor }}>
						<TouchableOpacity onPress={props.examStopClickHandler}>
							<Ionicons name='close-circle-sharp' color={Colors.white} size={28} />
							{/* <FontAwesome5 name="window-close" color={Colors.black} size={24} /> */}
						</TouchableOpacity>
					</View>
				}
				{
					props.showProfileDetailsSaveIcon &&
					<View style={{ ...styles.rightIcon, borderBottomColor: Colors.headingColor }}>
						<TouchableOpacity onPress={props.saveButtonClickHandler}>
							<Text style={{...GS.textWhite , ...GS.fs16}} >Save</Text>
						</TouchableOpacity>
					</View>
				}


			</View>

		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 60,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: Colors.headingColor,
	},
	leftContainer: {
		flex: 2,
		flexDirection: 'row',
	},
	rightContainer: {
		//flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	leftIcon: {
		width: 50,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	textArea: {
		flex: 1,
		justifyContent: 'center',
	},
	headerText: {
		fontSize: 19,
		color: Colors.white
	},
	rightIcon: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 15,
		borderBottomWidth: 2
	},
	profileIcon: {
		width: 30,
		height: 30,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: Colors.white,
	},
	badge: {
		position: 'absolute',
		minWidth: 20,
		height: 20,
		padding: 0,
		right: -7,
		top: -7,
		zIndex: 1,
		opacity: 0.85,
		backgroundColor: Colors.red,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	badgeText: {
		color: Colors.white
	},
});

export default AppHeader;