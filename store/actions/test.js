import { getApiResponse } from '../core/apiCaller';

export const getList = (examId, batchId, completed = false,is_remedial) => {
	return async (dispatch, getState) => {
		const data = new FormData();
		data.append('examId', examId);
		data.append('batchId', batchId);
		data.append('completed', completed);
		data.append('is_remedial',is_remedial );
		const response = await getApiResponse(data, 'test/getList', getState());
		
		return response.data;
	}
};

export const getQuestions = (test_id, instaR = 0) => {
	return async (dispatch, getState) => {
		const data = new FormData();
		data.append('test_id', test_id);
		data.append('instaR', instaR);
		console.log(instaR);
		const response = await getApiResponse(data, 'test/getQuestions', getState());
		return response.data;
	}
};


export const submitTest = (formValues) => {
	return async (dispatch, getState) => {
		const data = new FormData();
		for (const fv in formValues) {
			data.append(fv.toString(), formValues[fv].toString());
		}
		const response = await getApiResponse(data, 'test/submitTest', getState());
		return response;
	}
};

export const updateInstaRStatus = (test_id) => {
	return async (dispatch, getState) => {
		const data = new FormData();
		data.append('test_id', test_id);
		const response = await getApiResponse(data, 'test/updateInstaRStatus', getState());
		return response;
	}
};

export const changeBookmark = (question_id) => {
	return async (dispatch, getState) => {
		const data = new FormData();
		data.append('question_id', question_id);
		const response = await getApiResponse(data, 'test/changeBookmark', getState());
		return response;
	}
};

export const reportQuestion = (question_id, reporting_type, reported_id, remarks , exam_id) => {
	return async (dispatch, getState) => {
		if (remarks == undefined) remarks = '';
		const data = new FormData();
		data.append('id', reported_id);
		data.append('exam_id', exam_id);
		data.append('question_id', question_id);
		data.append('reporting_type', reporting_type);
		data.append('remarks', remarks);
		const response = await getApiResponse(data, 'test/reportQuestion', getState());
		return response;
	}
};


export const getOpenTestQuestion = (examId, special = 0) => {
	return async (dispatch, getState) => {
		if (special == undefined) special = 0;
		const data = new FormData();
		data.append('examId', examId);
		data.append('special', special);
		const response = await getApiResponse(data, 'test/getOpenTestQuestion', getState());
		return response.data;
	}
};

export const submitOpenTest = (formValues) => {
	return async (dispatch, getState) => {
		const data = new FormData();
		for (const fv in formValues) {
			data.append(fv.toString(), formValues[fv].toString());
		}
		const response = await getApiResponse(data, 'test/submitOpenTest', getState());
		return response;
	}
};