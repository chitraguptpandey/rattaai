import React, { useDebugValue } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons'

import { Text, Bold } from './Tags';
import CardView from './CardView';
import Colors from '../constants/Colors';
import * as GlobalFunctions from '../common/GlobalFunctions';

const CardData = props => {

    const { width } = Dimensions.get('window');
    const itemWidth = (width / (props.fullWidth ? 1 : 2)) - (props.fullWidth ? 30 : 20);

    const downloadClickHandler = (uri) => {
        GlobalFunctions.openLiveFile(props.sourceFolder, uri);
    }

    const renderDataItems = () => {
        let arrItems = [];
        const downloadables = props.downloadables ? props.downloadables : '';
        props.fields.map((item, index) => {
            arrItems.push(<View style={{ width: itemWidth, paddingVertical: 4 }} key={index}>
                <Bold style={styles.label}>{props.titles[index]}</Bold>
                {
                    downloadables.indexOf(props.fields[index], 0) > -1 && props.data[props.fields[index]] != '' &&
                    <TouchableWithoutFeedback onPress={() => { downloadClickHandler(props.data[props.fields[index]]) }}>
                        <Text style={styles.download}>
                            View/Download
                        </Text>
                    </TouchableWithoutFeedback>
                }
                {
                    downloadables.indexOf(props.fields[index], 0) == -1 &&
                    <Text style={styles.dataText}>
                        {
                            props.yesNoFieldIndices != undefined && props.yesNoFieldIndices.includes(index) ?
                                props.data[props.fields[index]] == '1' ? 'Yes' : 'No' :
                                props.data[props.fields[index]] == '' ? '-NA-' : props.data[props.fields[index]]
                        }
                    </Text>
                }
            </View>);
        });

        return arrItems;
    }

    const renderActionIcons = () => {
        let lstActions = [];
        props.actions.map((action, i) => {
            lstActions.push(
                <View key={i} style={styles.iconContainer}>
                    <MaterialIcons name={props.actionIcons[i]} size={22} style={styles.actionIcon}
                        color={props.actionIconColors[i]}
                        onPress={() => action(props.data[props.pkid])} />
                </View>
            );
        });
        return lstActions;
    }

    return (
        <CardView>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {renderDataItems()}
            </View>
            {
                props.hasActions &&
                <View style={styles.footer}>
                    {renderActionIcons()}
                </View>
            }
        </CardView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        width: '100%',
        marginVertical: 3
    },
    dataCell: {
        paddingHorizontal: 3
    },
    label: {
        fontSize: 15,
        textTransform: 'capitalize'
    },
    left: {
        alignItems: 'flex-start',
        paddingHorizontal: 10
    },
    right: {
        alignItems: 'flex-end',
        paddingHorizontal: 10,
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    dataText: {
        color: Colors.black1
    },
    footer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: Colors.gray,
        borderTopWidth: 1,
        paddingTop: 7,
        marginTop: 5
    },
    iconContainer: {
        backgroundColor: Colors.offWhite,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    actionIcon: {
        padding: 3
    },
    download: {
        fontSize: 15,
        color: Colors.primaryDark,
        lineHeight: 22
    }
});

export default CardData;
