import Variables from '../../constants/Variables';

export const paymentMode = () => {
    return async () => {
        const baseUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;

        const apiResponse = await fetch(
            baseUrl + 'api/Paymentmode',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!apiResponse.ok) {
            throw new Error('Unable to connect to the server' + apiResponse.status);
        }

        const textResponse = await apiResponse.text();
        const response = JSON.parse(textResponse);

        return response;
    }

}