import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Alert, ImageBackground } from 'react-native';
import { DrawerItemList, DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import myBackgroundImage from '../assets/drawerbg.png'
import { Bold, Text } from '../components/Tags';
import { Ionicons } from '@expo/vector-icons';

import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as GlobalFunctions from '../common/GlobalFunctions';
import GS from '../common/GlobalStyles';

import Colors from '../constants/Colors';
import DrawerMenu from './DrawerMenu';

import * as loginActions from '../store/actions/login';

import { useSelector, useDispatch } from 'react-redux';
import Variables from '../constants/Variables';

const STATUSBAR_HEIGHT = Constants.statusBarHeight + (Platform.OS === 'ios' ? 5 : 0);

const DrawerContent = (route, props) => {

    const loginStateData = useSelector(state => state.login);

    const dispatch = useDispatch();

    const menuClickHandler = (menuName) => {
        if (menuName == 'Logout') {
            route.navigation.closeDrawer();
            Alert.alert(
                'Logging out?',
                'Do you really want to logout?',
                [
                    {
                        text: 'No', onPress: () => {
                            console.log('Logout Cancelled');
                        }
                    },
                    {
                        text: 'Yes', onPress: async () => {
                            //AsyncStorage.clear();
                            await dispatch(loginActions.clearLoginState());
                            GlobalFunctions.navigate(route, 'Login');
                        }
                    },
                ],
                {
                    cancelable: false
                }
            )
        } else {
            GlobalFunctions.navigate(route, menuName);
        }
    }

    console.log(props)

    const renderMenuItems = () => {
        const menuItems = [
            { icon: 'home', text: 'Dashboard', route: 'Dashboard' },
            { text: 'Separator', route: 'Seperator1' },
            { icon: 'account', text: 'Profile', route: 'Profile' },
            { text: 'Separator1', route: 'Seperator1' },

            // { text: 'Notifications', route: 'Notifications' },
            { icon: 'book-account-outline', text: 'Mega Test', route: 'MegaTest' },
            { text: 'Separator', route: 'Seperator1' },

            { icon: 'file-document-edit', text: 'Mega Test Result', route: 'MegaTestResult' },
            { text: 'Separator', route: 'Seperator1' },

            { icon: 'book-account-outline', text: 'Remedial Test', route: 'RemedialTest' },
            { text: 'Separator', route: 'Seperator1' },

            { icon: 'file-document-edit', text: 'Remedial Test Result', route: 'RemedialTestResult' },
            { text: 'Separator', route: 'Seperator1' },

            { icon: 'file-document-multiple', text: 'One Test', route: 'OpenTest' },
            { text: 'Separator', route: 'Seperator1' },

            // { icon: 'file-document-outline', text: 'Special One Test', route: 'SpecialOpenTest' },
            // { text: 'Separator', route: 'Seperator1' },

            { icon: 'file-document-outline', text: 'Personal Test', route: 'PersonalTest' },
            { text: 'Separator', route: 'Seperator1' },

            { icon: 'file-document-outline', text: 'Personal Result', route: 'PersonalResult' },
            { text: 'Separator', route: 'Seperator1' },

            // { icon: 'file-document-outline', text: 'Week Test', route: 'WeekTest' },
            // { text: 'Separator', route: 'Seperator1' },

            // { icon: 'file-document-outline', text: 'Week Result', route: 'WeekResult' },
            // { text: 'Separator', route: 'Seperator1' },

            // { icon: 'cart-plus', text: 'Buy Exam(s)', route: 'BuyExams' },
            // { text: 'Separator', route: 'Seperator1' },

            // { icon: 'chart-histogram', text: 'Purchase History', route: 'Purchasehistory' },
            // { text: 'Separator', route: 'Seperator1' },


        ];
        let arrMenu = [];

        menuItems.map((item, index) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            if (item.text.indexOf('Separator', 0) > -1) {
                arrMenu.push(
                    <View key={`${item.text}-${index}`} style={{ backgroundColor: Colors.gray, width: '100%', height: 1 }}></View>
                )
            }
            else {
                arrMenu.push(
                    <DrawerItem
                        icon={({ focused, size }) => (
                            <MaterialCommunityIcons name={item.icon} size={24}
                                color="white"
                                style={{ ...GS.h30, ...GS.pt5, ...GS.rounded45 }} />
                        )}
                        key={item.route}
                        label={item.text}
                        focused={routeName == item.route}
                        inactiveTintColor={Colors.white}
                        activeTintColor={Colors.primary}
                        labelStyle={styles.drawerMenuText}
                        onPress={() => menuClickHandler(item.route)}
                    />
                )
            }
        });

        return arrMenu;
    }

    return (
        <View style={styles.headerMain}>

            <ImageBackground
                style={styles.backgroundImage}
                source={myBackgroundImage}
            >
                <View style={styles.headerSpace}>
                    <View style={styles.logoContainer}>
                        <View style={{ ...GS.f1, ...GS.acenter, ...GS.mt5 ,...GS.mr10 }}>
                            <Image source={require('../assets/logo.png')} style={styles.logo} />
                        </View>
                        <View style={{ ...GS.f1, ...GS.mt20 ,...GS.mr50 }}>
                            <Bold style={{...GS.textWhite}}  >{Variables.LoginUser}</Bold>

                        </View>
                    </View>
                </View>
                <DrawerContentScrollView  >
                <View style={{ backgroundColor: Colors.gray, width: '100%', height: 1  }}></View>

                    {renderMenuItems()}
                    <DrawerItem
                        label="Logout"
                        icon={({ focused, size }) => (
                            <MaterialCommunityIcons name='logout' size={24}
                                color="white"
                                style={{ ...GS.h30, ...GS.pt5, ...GS.rounded45  }} />
                        )}
                        inactiveTintColor={Colors.lightBlack}
                        activeTintColor={Colors.primaryDark}
                        activeBackgroundColor={Colors.primary}
                        labelStyle={styles.logoutMenuText}
                        onPress={() => menuClickHandler('Logout')}
                    />
                    <View style={{ backgroundColor: Colors.gray, width: '100%', height: 1 }}></View>


                    <View style={{ ...GS.acenter, ...GS.mv50 }}>
                        <Image source={require('../assets/drawerfooterlogo.png')} style={styles.footerlogo} />
                    </View>


                </DrawerContentScrollView>


            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    headerMain: {
        flex: 1,
    },
    headerSpace: {
       
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 7,
        marginTop: STATUSBAR_HEIGHT
    },
    logoContainer: {
        width: 70,
        height: 70,
        flexDirection: 'row',
        width: '100%'
        //borderRadius: 50,
    },
    logo: {
        width: 65,
        height: 65,
        //borderRadius: 50,
    },
    footerlogo: {
        width: 70,
        height: 100,
        //borderRadius: 50,
    }


    , backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    drawerMenuText: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    logoutTouchable: {
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 5,

    },
    logoutMenu: {
        paddingHorizontal: 10,
        paddingVertical: 13,
    },
    logoutMenuText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.white
    }
});


export default DrawerContent;