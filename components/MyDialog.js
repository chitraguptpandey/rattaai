import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import GS from '../common/GlobalStyles';

import { Dialog } from 'react-native-simple-dialogs';

import Colors from '../constants/Colors';
import SubmitButton from './SubmitButton';

const MyDialog = props => {

    const [isDialogVisible, setIsDialogVisible] = useState(props.isVisible)

    useEffect(() => {
        setIsDialogVisible(props.isVisible);
    }, [props])

    const hideDialog = () => {
        setIsDialogVisible(false);
        props.hideDialog();
    }

    return (
        <Dialog
            visible={isDialogVisible}
            dialogStyle={{ ...styles.dialogContainer, ...props.style }}
            contentStyle={styles.dialogContent}
            titleStyle={{ ...styles.dialogTitleStyle, ...props.titleStyle }}
            title={props.title}
            keyboardShouldPersistTaps="handled"
            onTouchOutside={hideDialog}
        >
            {props.children}
        </Dialog>
    );
}

const styles = StyleSheet.create({
    dialogContainer: {
        height: 300,
        borderRadius: 20
    },
    dialogContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    dialogTitleStyle: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        margin: 0,
        color: Colors.headingColor,
        fontSize: 25,
       
        textAlign: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

    },
});

export default MyDialog;

