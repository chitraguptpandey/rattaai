import Variables from "../../constants/Variables";

export const addStudent = async (studentData) => {
    const baseUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;

    const formData = new FormData();
    for (const key in studentData) {
        formData.append(key, studentData[key]);
    }

    const apiResponse = await fetch(
        baseUrl + 'api/addstudent/addUser',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData
        }
    );

    if (!apiResponse.ok) {
        throw new Error(`Unable to connect to the server. Status: ${apiResponse.status}`);
    }

    return apiResponse.json(); 
}

export const addStudentCourse = (data) => {
    return async () => {
        const baseUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;

        const apiResponse = await fetch(
            baseUrl + 'api/addstudent/addcourse',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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


export const getExamdetails = () => {
    return async () => {
        const baseUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;

        const apiResponse = await fetch(
            baseUrl + 'api/examsbatches',
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

export const getBatchesList= (data) => {
    return async () => {
        const baseUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;

        const apiResponse = await fetch(
            baseUrl + 'api/examsbatches/batches',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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






