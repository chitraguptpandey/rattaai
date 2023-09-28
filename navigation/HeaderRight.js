import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons'

import { Text } from '../components/Tags';

import Colors from '../constants/Colors'

const HeaderRight = props => {

    return (
        <View style={{ flexDirection: 'row' }}>
            <Text>RIGHT_HEADER</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        width: 20,
        height: 20,
        right: 2,
        top: 2,
        zIndex: 1,
        backgroundColor: Colors.red
    },
    badgeText: {
        color: Colors.white
    }
});

export default HeaderRight;