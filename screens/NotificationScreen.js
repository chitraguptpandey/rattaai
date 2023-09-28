import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from '../components/Tags';
import MyContainer from '../components/MyContainer';
import { Bold } from '../components/Tags';
import * as GlobalFunctions from '../common/GlobalFunctions';
import GS from '../common/GlobalStyles';
import Colors from '../constants/Colors';

const NotificationScreen = props => {

    const [notifications, setNotifications] = useState(
        [
            { 'title': 'Notification Title 1', 'content': 'Notification content 1 will be shown here, this can be in multiple lines', 'notification_date': '15-Jan-2010' },
            { 'title': 'Notification Title 2', 'content': 'Notification content 2 will be shown here, this can be in multiple lines', 'notification_date': '14-Jan-2010' },
            { 'title': 'Notification Title 3', 'content': 'Notification content 3 will be shown here, this can be in multiple lines', 'notification_date': '13-Jan-2010' },
            { 'title': 'Notification Title 4', 'content': 'Notification content 4 will be shown here, this can be in multiple lines', 'notification_date': '12-Jan-2010' },
            { 'title': 'Notification Title 5', 'content': 'Notification content 5 will be shown here, this can be in multiple lines', 'notification_date': '11-Jan-2010' },
            { 'title': 'Notification Title 6', 'content': 'Notification content 6 will be shown here, this can be in multiple lines', 'notification_date': '10-Jan-2010' }
        ]
    );

    const renderNotifications = () => {
        let arrItems = [];

        notifications.map((item, index) => {
            arrItems.push(<View style={styles.notificationStrip} key={index}>
                <Bold style={{ fontSize: 20, paddingVertical: 5 }}>{item.title}</Bold>
                <Text style={{ fontSize: 18, lineHeight: 24 }}>{item.content}</Text>
                <Text style={styles.date}>{item.notification_date}</Text>
            </View>);
        });

        return arrItems;
    }

    return (
        <MyContainer navigation={props.navigation} title="Notifications" highlightNotificationIcon={true}>
            <View style={{ padding: 10 }}>
                {renderNotifications()}
            </View>
        </MyContainer>
    )
}

const styles = StyleSheet.create({
    notificationStrip: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray
    },
    date: {
        width: '100%',
        textAlign: 'right',
        marginTop: 5,
        color: Colors.darkGray,
        marginBottom: 15
    }
})

export default NotificationScreen;
