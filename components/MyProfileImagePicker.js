import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet, Alert, TouchableWithoutFeedback, PermissionsAndroid, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';

import Variables from '../constants/Variables';
import Colors from '../constants/Colors';
import * as GlobalFunctions from '../common/GlobalFunctions';

const MyProfileImagePicker = props => {

    const [inputValue, setInputValue] = useState(props.initialValue);
    let [askedPermissionOnLoad, setAskedPermissionOnLoad] = useState(false);

    useEffect(() => {
        if (!askedPermissionOnLoad && Platform.OS === 'android') {
            setAskedPermissionOnLoad(true);
            setTimeout(() => {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            }, 500);
        }
    }, [props]);

    const verifyPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            GlobalFunctions.showMessage('Insufficient Permission', Variables.CameraPermisionMsg);
            return false;
        }

        /*const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY, Permissions.MEDIA_LIBRARY_WRITE_ONLY);
        if (result.status !== 'granted') {
            GlobalFunctions.showMessage('Insufficient Permission', Variables.CameraPermisionMsg);
            return false;
        }*/
        return true;
    };

    const verifyAndroidPermissions = async () => {
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            if (result !== PermissionsAndroid.RESULTS.GRANTED) {
                GlobalFunctions.showMessage('Insufficient Permission', Variables.StoragePermissionMsg);
            }
        }
        return true;
    };

    const filePickerHandler = async () => {
        if (props.submitting) return;

        const hasPermissions = await verifyAndroidPermissions();
        if (!hasPermissions) {
            GlobalFunctions.showMessage('Insufficient Permission', Variables.StoragePermissionMsg);
            return;
        }
        const image = await DocumentPicker.getDocumentAsync({ type: "image/*", copyToCacheDirectory: false });
        if (image.size > 10000000) {
            GlobalFunctions.showMessage('Image Size Exceeded', 'File only upto 10 MB allowed');
            return;
        }

        if (image.uri != undefined && image.uri != '' && image.type === 'success') {

            const fileInfo = await FileSystem.getInfoAsync(image.uri.toString());
            if (!fileInfo.exists) {
                GlobalFunctions.showMessage(
                    'Image Not Exists',
                    'The image you have selected does not exists on your phone & showing its reference only\n\n' +
                    'Select image from specific storage instead of from Downloads App / Recent Files');
                return;
            }
            
            setInputValue(image.uri.toString());
            props.value[props.name] = { 'uri' : image.uri.toString(), 'name' : image.name };
            
            if(props.onImageSelected) {
                props.onImageSelected();
            }
        }
    };

    const askForImageOption = async () => {
        Alert.alert('Profile Pic / Logo', 'Please choose any one option',
            [
                { text: 'Use Camera', onPress: () => { takeImageHandler() } },
                { text: 'Select From Gallery', onPress: () => { filePickerHandler() } },
            ],
            {
                cancelable: true
            }
        );
    }

    const takeImageHandler = async () => {
        const hasPermissions = await verifyPermissions();
        if (!hasPermissions) {
            GlobalFunctions.showMessage('Insufficient Permission', Variables.CameraPermisionMsg);
            return;
        }
        
        const image = await ImagePicker.launchCameraAsync({ quality: 0.8 });
		
        if(image.canceled) {
            return;
        }

        setInputValue(image.assets[0].uri.toString());
        props.value[props.name] = { 'uri' : image.assets[0].uri.toString(), 'name' : 'AnyName.jpg' };  

        if(props.onImageSelected) {
            props.onImageSelected();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={askForImageOption}>
            <View style={styles.imageContainer}>
                {/* <ImageBackground style={styles.imageBg} source={require('../assets/no_image_available.png')}> */}
                    {
                        inputValue != undefined && inputValue != '' ?
                        <Image source={{ uri: inputValue }} style={{...styles.userImage, ...props.userImageStyle}} /> :
                        <Image source={require('../assets/no_image_available.png')} style={{...styles.userImage, ...props.userImageStyle}} />
                    }
                {/* </ImageBackground> */}
                <View style={styles.cameraIcon}>
                    <FontAwesome name="camera" size={20} color={Colors.white} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    imagePicker: {
        alignItems: 'center'
    },
    imageContainer: {
        width: 140,
        height: 140,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 150,
        justifyContent: 'center',
        alignItems: 'center',
        //borderColor: Colors.primaryDark,
        //borderWidth: 4,
    },
    imageBg: {
        width: 140,
        height: 140,
        resizeMode: 'contain'
    },
    userImage: {
        width: 140,
        height: 140,
        borderRadius: 140,
        borderWidth: 5,
        borderColor: Colors.black,
        resizeMode: 'cover'
    },
    cameraIcon: {
        width: 40,
        height: 40,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primaryDark,
        position: 'absolute',
        left: 95,
        top: 95
    }
});

export default MyProfileImagePicker;
