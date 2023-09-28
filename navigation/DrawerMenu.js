import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Alert, Image, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Text } from '../components/Tags';

import { useDispatch } from 'react-redux';

import { MaterialIcons } from '@expo/vector-icons';

import Collapsible from 'react-native-collapsible';
import Colors from '../constants/Colors';
import MyIcon from '../components/MyIcon';
import Variables from '../constants/Variables';
import * as GlobalFunctions from '../common/GlobalFunctions';

import * as loginActions from '../store/actions/login';
import MyDialog from '../components/MyDialog';


const DrawerMenu = props => {
    
    const dispatch = useDispatch();

    const [open, setOpen] = useState(props.isOpen != undefined ? props.isOpen : false);
    const animatedController = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (props.expandedMenuName != props.menu.name) {
            Animated.timing(animatedController, {
                duration: 50,
                toValue: props.isOpen ? 1 : 0,
                useNativeDriver: true,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            }).start();
            setOpen(false);
        }
    }, [props])

    const arrowAngle = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: props.isOpen ? [`${Math.PI}rad`, '0rad'] : ['0rad', `${Math.PI}rad`],
        //outputRange: [`${Math.PI}rad`, '0rad'],
    });

    const toggleListItem = (menuName) => {
        if (open) {
            Animated.timing(animatedController, {
                duration: 300,
                toValue: props.isOpen ? 1 : 0,
                useNativeDriver: true,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            }).start();
            props.onExpandCollapse(menuName);
        } else {
            Animated.timing(animatedController, {
                duration: 300,
                toValue: props.isOpen ? 0 : 1,
                useNativeDriver: true,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            }).start();
            props.onExpandCollapse('');
        }
        setOpen(!open);
    };

    const menuClicked = menu => {
        console.log(menu)
        props.navigation.closeDrawer();

        if (menu.route == 'Logout') {

    
            GlobalFunctions.showConfirmation('Logging out ?', 'Do you really want to logout ?', logout);
        } else {
            Variables.HeaderTitle = menu.headerTitle;
            GlobalFunctions.navigate(props, menu.route);
        }
    }

    const logout = async() => {
        AsyncStorage.clear();
        await dispatch(loginActions.clearLoginState());
        GlobalFunctions.navigate(props, 'Login');
    }

    const renderChildMenus = () => {
        let childMenus = [];

        props.menu.children.map((item, index) => {
            if (item.visible) {
                childMenus.push(
                    <TouchableWithoutFeedback key={index} onPress={() => menuClicked(item)}>
                        <View style={styles.childMenu}>
                            <View style={{ flexDirection: 'row' }}>
                                {/* <Image source={item.icon} style={styles.menuIcon} /> */}
                                <MyIcon iconType={item.iconType} name={item.iconName} />
                                <Text style={styles.menuText}>{item.name}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
            }
        });

        return childMenus;
    }

    return (
        <View style={styles.containerStyle}>
            {
                props.menu.children.length > 0 ?
                    <>
                        <TouchableWithoutFeedback onPress={() => toggleListItem(props.menu.name)}>
                            <View style={styles.parentMenu}>
                                <View style={{ flexDirection: 'row' }}>
                                    {/* <Image source={props.menu.icon} style={styles.menuIcon} /> */}
                                    <MyIcon iconType={props.menu.iconType} name={props.menu.iconName} />
                                    <Text style={styles.menuText}>{props.menu.name}</Text>
                                </View>
                                <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }}>
                                    <MaterialIcons name="keyboard-arrow-down" size={24} color="black" style={{ marginTop: 2 }} />
                                </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>
                        <Collapsible collapsed={!open}>
                            {renderChildMenus()}
                        </Collapsible>
                    </> :
                    <TouchableWithoutFeedback onPress={() => menuClicked(props.menu)}>
                        <View style={styles.parentMenu}>
                            <View style={{ flexDirection: 'row' }}>
                                {/* <Image source={props.menu.icon} style={styles.menuIcon} /> */}
                                <MyIcon iconType={props.menu.iconType} name={props.menu.iconName} />
                                <Text style={styles.menuText}>{props.menu.name}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    bodyBackground: {
        /*backgroundColor: '#cccccc',*/
    },
    rotated: {
        transform: [{ rotate: '180deg' }]
    },
    menuIcon: {
        width: 18,
        height: 18,
        marginRight: 15,
        marginTop: 3
    },
    menuText: {
        fontSize: 19,
    },
    parentMenu: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 12
    },
    childMenu: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 14,
        backgroundColor: Colors.white1,
        borderTopWidth: 1,
        borderTopColor: Colors.lightBlack
    },
    containerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightBlack
    }
});

export default DrawerMenu;