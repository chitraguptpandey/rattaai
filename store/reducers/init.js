const initialState = {
    SupportEmail: '',
    SupportMobile: '',
    OpenTestInstructions: '',
	SpecialOpenTestInstructions: '',
    IntroSliders: []
};

export default (state = initialState, action) => {
    if (action.type == 'SET_DEFAULT_DATA') {
        return {
            ...state,
            SupportEmail: action.SupportEmail,
            SupportMobile: action.SupportMobile,
            OpenTestInstructions: action.OpenTestInstructions,
			SpecialOpenTestInstructions: action.SpecialOpenTestInstructions,
            IntroSliders: action.IntroSliders
        }
    }
    return state;
};