import { getApiResponse } from '../core/apiCaller';

export const getData = (examId, batchId) => {
    return async (dispatch, getState) => {
        const data = new FormData();
		data.append('examId', examId);
		data.append('batchId', isNaN(batchId) ? 0 : batchId);
        const response = await getApiResponse(data, 'dashboard/get', getState());
        return response.data;
    }
};