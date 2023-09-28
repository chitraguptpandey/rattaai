import Colors from './Colors';

const Validation = Object.freeze({
    Required: 'Required',
    Email: 'Email',
    EmailRequired: 'EmailRequired',
    Mobile: 'Mobile',
    MobileRequired: 'MobileRequired',
    Number: 'Number',
    NumberRequired: 'NumberRequired',
    Decimal: 'Decimal',
    DecimalRequired: 'DecimalRequired',
    MinLength: 'MinimumLength',
    MinLengthRequired: 'MinLengthRequired'
});

const Keyboard = Object.freeze({
    Default: 'default',
    Number: 'numeric',
    Email: 'email-address',
    Phone: 'phone-pad'
});

const Capitalize = Object.freeze({
    None: 'none',
    Words: 'words',
    Sentences: 'sentences',
    Characters: 'characters'
});

/* These names are of Material Icons Only */
const ActionButtons = Object.freeze({
    Edit: 'mode-edit',
    Delete: 'delete-forever',
    View: 'remove-red-eye',
    Place: 'place',
    Attachment: 'attach-file',
    Download: 'file-download',
    Upload: 'file-upload',
    Assignment: 'assignment-ind',
    Accept: 'assignment-turned-in',
    Person: 'person-pin-circle',
    Schedule: 'schedule'
});

const ActionButtonColors = Object.freeze({
    Edit: Colors.darkGreen,
    Delete: Colors.red,
    View: Colors.primaryDark,
    Place: Colors.black2,
    Attachment: Colors.primaryDark,
    Download: Colors.darkGreen,
    Upload: Colors.darkGreen,
    Assignment: Colors.darkGreen,
    Accept: Colors.primaryDark,
    Person: Colors.black2,
    Schedule: Colors.black2
});

const UploadFileTypes = Object.freeze({
    Pdf: "application/pdf",
    Image: "image/*",
    Any: "*/*",
});

const OtpSendingStatus = Object.freeze({
    Pending: 0,
    Sending: 1,
    Sent: 2,
    CanResend: 3,
});

const TestMenuStages = Object.freeze({
    Submit: 1,
    ReConfirm: 2,
    Submitted: 3,
    Timeout: 4
});

const QuestionReportTypes = Object.freeze({
    WrongLanguage: 1,
    WrongOption: 2,
    WrongAnswer: 3,
    WrongExplanation: 4
});


export const ValidationType = Validation;
export const KeyboardType = Keyboard;
export const CapitalizeType = Capitalize;
export const ActionIcons = ActionButtons;
export const ActionIconColors = ActionButtonColors;
export const FileType = UploadFileTypes;
export const OtpStatus = OtpSendingStatus;
export const TestMenuStage = TestMenuStages;
export const QuestionReportType = QuestionReportTypes;