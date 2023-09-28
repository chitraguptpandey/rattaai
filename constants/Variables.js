export default {
    IsLive:true,

    IsLoggedIn: false,

    LoggedInAsSeller: true,

    LiveApiBaseUrl: 'http://13.50.204.100/',
    //LiveApiBaseUrl: 'http://dh.prdigitals.in/',
    //LiveApiBaseUrl: 'http://3.111.217.203/',

    LocalApiBaseUrl: 'http://192.168.1.14/quesbank/',
    //LocalApiBaseUrl: 'http://192.168.1.3/quesbank/',
    LoginUser : '',
	MyTimer: null,
	LastKeyupTime: 0,
	RemainingSeconds : 0,

	ExamId : 0,
	BatchId: 0,
    is_remedial : '',
    ProfileImageUrl: 'assets/images/student/',

    IntroImageUrl: 'assets/images/introslider/',

    HeaderTitle: 'Dashboard',

    CameraPermisionMsg: 'You need to allow camera permissions in order to use camera',

    StoragePermissionMsg: 'You need to allow storage permissions in order to use this app',

    ValidationErrorText: 'Please Resolve Errors',
    ValidationButtonText: 'Okay',
    ValidationToastDuration: 800,
    ValidationToastPosition: 'bottom',
    ValidationErrorClass: 'danger',

    ProfileStack: ['PersonalDetails', 'EducationDetails', 'ContactDetails', 'AccountDetails', 'ChangePassword'],
    
    SwipeDisabledRoutes: ['PersonalDetails', 'EducationDetails', 'ContactDetails', 'AccountDetails', 'ChangePassword', 'StartTest'],

    YesNoOptions: [
        { text: 'Yes', value: '1' },
        { text: 'No', value: '0' }
    ],
    
    GenderOptions: [
        { text: 'Male', value: '1' },
        { text: 'Female', value: '2' },
        { text: 'Trans Gender', value: '3' }
    ],

    CasteType: [
        Object({ id: 1, name: 'General' }),
        Object({ id: 2, name: 'SC' }),
        Object({ id: 3, name: 'ST' }),
        Object({ id: 4, name: 'OBC' }),
        Object({ id: 5, name: 'EWS' }),
        Object({ id: 6, name: 'MBC' }),
        Object({ id: 7, name: 'TSP' }),
        Object({ id: 8, name: 'Other' })
    ],

    States: [
        Object({ id: 1, name: 'Rajasthan' }),
        Object({ id: 2, name: 'Gujrat' }),
        Object({ id: 3, name: 'Madhya Pradesh' })
    ],

    LanguageType: [
        Object({ id: 1, name: 'English' }),
        Object({ id: 2, name: 'Hindi' })
    ],

    htmlPrefix: "<html> \
                    <head> \
                        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' /> \
                        <style type='text/css'> \
                            html, body { font-weight: bold; width: 98%; height: auto, padding: 0px, margin: 0px; } \
                            table { border-collapse: collapse; } \
                            td { border: solid 1px black; padding: 5px 10px 5px 10px; } \
                        </style> \
                    </head> \
                <body>",

    htmlSuffix: "<script>setTimeout(function() { window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight); }, 500); true;</script></body></html>",

    footerScript: "setTimeout(function() { window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight); }, 500); true;",

    //html, body, table { font-size: 50px; font-weight: bold; } \

}