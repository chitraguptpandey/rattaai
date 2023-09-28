import AsyncStorage from '@react-native-async-storage/async-storage';
import Variables from '../../constants/Variables';
import { getApiResponse } from '../core/apiCaller';

export const login = (email, password) => {
    return async dispatch => {
        const data = new FormData();
        data.append('email', email);
        data.append('password', password);

        const pushToken = await AsyncStorage.getItem('pushToken');
        data.append('pushToken', pushToken);

        const jsonResponse = await getApiResponse(data, 'login');

        if (jsonResponse.status == 'Error') {
            throw new Error(jsonResponse.message);
        }

        dispatch({
            type: 'LOGIN',
            StudentId: jsonResponse.data.id,
            Email: jsonResponse.data.email,
            Mobile: jsonResponse.data.mobile,
            Password: password,
            Name: jsonResponse.data.name,
            ProfilePic: jsonResponse.data.profile_pic
        });

        await saveDataToSharedPreferences(email, password);
    }
};

export const sendForgotPwdOtp = (email) => {
    return async (dispatch, getState) => {
        const data = new FormData();
        data.append('email', email);
        const response = await getApiResponse(data, 'login/sendForgotPwdOtp', getState());
        return response.data;
    }
};

export const resetPassword = (formValues) => {
    return async () => {
        const data = new FormData();
        for (const fv in formValues) {
            data.append(fv.toString(), formValues[fv].toString());
        }
        await getApiResponse(data, 'login/resetPassword');
    };
};

export const clearLoginState = () => {
    return async dispatch => {

        AsyncStorage.setItem('studentData', JSON.stringify({
            email: '',
            password: ''
        }));

		AsyncStorage.setItem('ExamId', "0");
		AsyncStorage.setItem('BatchId', "0");
		Variables.ExamId = 0;
		Variables.BatchId = 0;

        dispatch({
            type: 'LOGIN',
            StudentId: 0,
            Email: '',
            Mobile: '',
            Password: '',
            Name: '',
            ProfilePic: ''
        });
    }
}

const saveDataToSharedPreferences = async (email, password) => {

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