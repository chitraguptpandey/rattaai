import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiResponse } from '../core/apiCaller';
import * as GlobalFunctions from '../../common/GlobalFunctions';

export const getProfile = () => {
    return async (dispatch, getState) => {
        const data = new FormData();
        const response = await getApiResponse(data, 'profile/get', getState());
        return response.data;
    }
};

export const updateProfile = (formValues) => {
    return async (dispatch, getState) => {

        const data = new FormData();
        for (let fv in formValues) {
            if (fv.toString() == 'profile_pic') {
                if (formValues[fv.toString()] != undefined && formValues[fv.toString()] != '') {
                    const fileType = GlobalFunctions.getFileType(formValues[fv.toString()].name);
                    data.append(fv.toString(), { uri: formValues[fv.toString()].uri, name: 'File.' + fileType.extn, type: fileType.mime });
                }
            } else {
                data.append(fv.toString(), formValues[fv].toString());
            }
        }

        const response = await getApiResponse(data, 'profile/update', getState());

        if (formValues['name'] != undefined || formValues['profile_pic'] != undefined) {
            dispatch({
                type: 'UPDATE_PROFILE',
                Name: response.data.name,
                ProfilePic: response.data.profile_pic
            });
        }

        return response.data;
    };
};

export const updateAccount = (formValues) => {
    return async (dispatch, getState) => {
        const data = new FormData();
        for (const fv in formValues) {
            data.append(fv.toString(), formValues[fv].toString());
        }

        const response = await getApiResponse(data, 'profile/updateAccount', getState());

        dispatch({
            type: 'UPDATE_ACCOUNT',
            Email: response.data.email,
            Mobile: response.data.mobile
        });

        await saveDataToSharedPreferences(response.data.email, '');

        return response.data;
    }
};

export const updatePassword = (formValues) => {
    return async (dispatch, getState) => {
        const data = new FormData();
        for (const fv in formValues) {
            data.append(fv.toString(), formValues[fv].toString());
        }
        await getApiResponse(data, 'profile/updatePassword', getState());

        dispatch({
            type: 'UPDATE_PASSWORD',
            Password: formValues['password']
        });
        await saveDataToSharedPreferences('', formValues['password']);
    }
};

export const sendEmailOtp = (email) => {
    return async (dispatch, getState) => {
        const data = new FormData();
        data.append('email', email);
        const response = await getApiResponse(data, 'profile/sendEmailOtp', getState());
        return response.data;
    }
};

export const sendMobileOtp = (mobile) => {
    return async (dispatch, getState) => {
        const data = new FormData();
        data.append('mobile', mobile);
        const response = await getApiResponse(data, 'profile/sendMobileOtp', getState());
        return response.data;
    }
};

const saveDataToSharedPreferences = async (email = '', password = '') => {
    if (email == '' || password == '') {
        const previousData = await AsyncStorage.getItem('studentData');
        if (previousData) {
            const objData = JSON.parse(previousData);
            if (email == '') {
                email = objData.email;
            }
            if (password == '') {
                password = objData.password;
            }
        }
    }

    AsyncStorage.setItem('studentData', JSON.stringify({
        email: email,
        password: password
    }));
};