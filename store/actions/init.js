import { getApiResponse } from '../core/apiCaller';

export const getDefaultData = () => {
    return async (dispatch, getState) => {
        const data = new FormData();
        data.append('validation', 'no');
        const response = await getApiResponse(data, 'init');

        dispatch({
            type: 'SET_DEFAULT_DATA',
            SupportEmail: response.data.settings.support_email,
            SupportMobile: response.data.settings.support_mobile,
            OpenTestInstructions: response.data.settings.open_test_instructions,
            SpecialOpenTestInstructions: response.data.settings.sp_open_test_instructions,
            IntroSliders: response.data.sliders
        });

        return response.data;
    }
};