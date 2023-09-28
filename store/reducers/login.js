const initialState = {
    StudentId: 0,
    Email: '',
    Mobile: '',
    Password: '',
    Name: '',
    ProfilePic: ''
};

export default (state = initialState, action) => {
    if (action.type == 'LOGIN') {
        return {
            ...state,
            StudentId: action.StudentId,
            Email: action.Email,
            Mobile: action.Mobile,
            Password: action.Password,
            Name: action.Name,
            ProfilePic: action.ProfilePic
        }
    } else if(action.type == 'UPDATE_PROFILE') {
        return {
            ...state,
            Name: action.Name,
            ProfilePic: action.ProfilePic
        }
    } else if(action.type == 'UPDATE_ACCOUNT') {
        return {
            ...state,
            Email: action.Email,
            Mobile: action.Mobile
        }
    } else if(action.type == 'UPDATE_PASSWORD') {
        return {
            ...state,
            Password: action.Password
        }
    }
    return state;
};