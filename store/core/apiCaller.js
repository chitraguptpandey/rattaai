import Variables from '../../constants/Variables';

export const getApiResponse = async (formData, apiUrl, appState = undefined) => {

    if (appState != undefined) {
        formData.append('login_email', appState.login.Email);
        formData.append('login_password', appState.login.Password);
    }

    const baseUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;

    console.log(baseUrl + 'api/' + apiUrl);

    const apiResponse = await fetch(
        baseUrl + 'api/' + apiUrl,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        }
    );

    const textResponse = await apiResponse.text();

    if (!apiResponse.ok) {
        console.log(textResponse + '\n\n\n');
        throw new Error('Unable to connect to the server' + apiResponse.status);
    }

    let jsonResponse = '';
    
    try {
        jsonResponse = JSON.parse(textResponse);
    } catch(ex) {
        console.log(textResponse + '\n\n\n');
        throw new Error('Some Error Occurred');
    }

    if (jsonResponse.status == 'Error') {
        console.log(textResponse + '\n\n\n');
        throw new Error(jsonResponse.message);
    }

    return jsonResponse;
}