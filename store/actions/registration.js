import { getApiResponse } from '../core/apiCaller';

export const validateEmail = (email) => {
	return async (dispatch, getState) => {
		const data = new FormData();
		data.append('email', email);
		const response = await getApiResponse(data, 'registration/validateEmail', getState());
		return response.data;
	}
};

export const getExams = (student_id = 0) => {
	return async (dispatch, getState) => {
		const data = new FormData();
		data.append('student_id', student_id);
		const response = await getApiResponse(data, 'registration/getExams', getState());
		return response.data;
	}
};


export const getPaymentHistory = (student_id = 0) => {
	return async (dispatch, getState) => {
		const data = new FormData();
		data.append('student_id', student_id);
		const response = await getApiResponse(data, 'Registration/getPaymentHistory', getState());
		return response.data;
	}
};
