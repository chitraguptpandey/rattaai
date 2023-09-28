import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import MyContainer from '../components/MyContainer';
import MyPickerInput from '../components/MyPickerInput';
import SubmitButton from '../components/SubmitButton';
import CancelButton from '../components/CancelButton';

import CardView from '../components/CardView';
import { Text, Bold } from '../components/Tags';
import * as GlobalFunctions from '../common/GlobalFunctions';
import GS from '../common/GlobalStyles';
import Colors from '../constants/Colors';
import Variables from '../constants/Variables';
import { ValidationType, KeyboardType, CapitalizeType } from '../constants/Enums';

const RemedialTestInstructionScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [showButtonLoader, setShowButtonLoader] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [testId, setTestId] = useState(0);
    const [testName, setTestName] = useState('');
    const [instructions, setInstructions] = useState('');
    const [duration, setDuration] = useState(0);

    const [formValues, setFormValues] = useState({ 'language_id': 2 });
    const [formErrors, setFormErrors] = useState({});
    const [formRefs, setFormRefs] = useState({});

    const startTestClickHandler = () => {
        GlobalFunctions.navigate(props, 'StartTest', { testId: testId, langId: formValues['language_id'], testName: testName, duration: duration, instaR : 0,screen: 1 });
    }

    const moveToTestList = () => {
        GlobalFunctions.navigate(props, 'RemedialTest');
    }

    useEffect(() => {
        setTestId(props.route.params.testId);
        setTestName(props.route.params.testName);
        setInstructions(props.route.params.instructions);
        setDuration(props.route.params.duration);
    }, [])

    return (
        <MyContainer navigation={props.navigation} title={testName}>
            {/* <View style={GS.row100}>
                <View style={{ ...styles.txtPrefLang, flex: 2 }}>
                    <Text style={{ color: Colors.primaryDark }}>Select Preferred Language</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <MyPickerInput name="language_id" value={formValues} error={formErrors} submitting={isSubmitting}
                        initialValue={formValues['language_id']} hideSelect={true} label="Language" pickerData={Variables.LanguageType}
                        pickerId="id" pickerValue="name" validationType={ValidationType.Required} refs={formRefs}
                        pickerStyle={{ height: 30 }} />
                </View>
            </View> */}
            <Text style={styles.testHeading}>Remedial Test</Text>
            <CardView style={GS.ph20}>
                <Bold style={GS.fs16}>Test Instruction</Bold>
                <Text style={{ ...GS.pv10, ...GS.fs15 }}>
                    {instructions}
                </Text>

                <SubmitButton title="Start Test" IsLoading={showButtonLoader} onPress={startTestClickHandler}  textStyle={{ ...GS.textWhite }} style={{ ...GS.bgBlueDark, ...GS.rounded50, ...GS.minw75, ...GS.mh10, ...GS.f1, }} />
                <CancelButton title="Cancel" onPress={moveToTestList} textStyle={{ ...GS.textWhite }} style={{ ...GS.bgPrimaryDark, ...GS.mh10,...GS.rounded50, ...GS.f1, ...GS.mb10, ...GS.mt10 }}  />

            </CardView>

        </MyContainer>
    )

}

const styles = StyleSheet.create({
    txtPrefLang: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginRight: 5,
        paddingBottom: 8
    },
    testHeading: {
        fontSize: 25,
        paddingHorizontal: 20,
        color: Colors.primaryDark,
    }
})

export default RemedialTestInstructionScreen;
