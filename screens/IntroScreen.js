import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector } from 'react-redux';

import AppIntroSlider from 'react-native-app-intro-slider';

import { Text, Bold } from '../components/Tags';

import GS from '../common/GlobalStyles';
import * as GlobalFunctions from '../common/GlobalFunctions';
import Colors from '../constants/Colors';

const IntroSlider = props => {

    const sliderData = useSelector(state => state.init.IntroSliders);

    const [isLoading, setIsLoading] = useState(true);
    const [slides, setSlides] = useState([]);

    useEffect(() => {

        let arrSlides = [];
        sliderData.map((item, index) => {
            arrSlides.push(
                {
                    key: (index + 1).toString(),
                    title: item.title,
                    text: item.content,
                    image: GlobalFunctions.getIntroImageUri(item.icon),
                    backgroundColor: '#59b2ab',
                }
            )
        });
        setSlides(arrSlides);
        setIsLoading(false);

    }, [props]);

    /*const slides = [
        {
            key: '1',
            title: 'Lorem Ipsum 1',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            image: require('../assets/intro_icon1.jpg'),
            backgroundColor: '#59b2ab',
        }
    ];*/

    const _renderItem = ({ item }) => {
        return (
            <View style={styles.slide}>
                <Image style={styles.itemIcon} source={{ uri: item.image }} />
                <Bold style={styles.title}>{item.title}</Bold>
                <Text style={styles.description}>{item.text}</Text>
            </View>
        );
    }

    const _renderSkipButton = () => {
        return (
            <View style={styles.navButton}>
                <Text style={styles.navText}>Skip</Text>
            </View>
        );
    };

    const _renderPrevButton = () => {
        return (
            <View style={styles.navButton}>
                <Text style={styles.navText}>Prev</Text>
            </View>
        );
    };

    const _renderNextButton = () => {
        return (
            <View style={styles.navButton}>
                <Text style={styles.navText}>Next</Text>
            </View>
        );
    };

    const _renderDoneButton = () => {
        return (
            <View style={styles.navButton}>
                <Text style={styles.navText}>Done</Text>
            </View>
        );

    }

    const doneClickHandler = () => {
        AsyncStorage.setItem('introStatus', 'done');
        GlobalFunctions.navigate(props, 'Login');
    }

    if (isLoading) {
        return (
            <View style={GS.centered}>
                <ActivityIndicator size="large" color={Colors.primaryDark} />
            </View>
        );
    }

    return (
        <ImageBackground source={require('../assets/intro_bg.png')} style={{ flex: 1 }} imageStyle={{ resizeMode: 'stretch' }}>

            <AppIntroSlider
                data={slides}
                renderItem={_renderItem}

                showPrevButton={true}
                showSkipButton={true}
                showNextButton={true}
                showDoneButton={true}

                renderPrevButton={_renderPrevButton}
                renderSkipButton={_renderSkipButton}
                renderNextButton={_renderNextButton}
                renderDoneButton={_renderDoneButton}

                onSkip={doneClickHandler}
                onDone={doneClickHandler}

                dotStyle={{ backgroundColor: '#c2e8f5' }}
                activeDotStyle={{ backgroundColor: '#54b7d9' }}
            />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    slide: {
        paddingHorizontal: 15,
        paddingTop: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 25,
        marginTop: 30,
        width: '100%',
        textAlign: 'center'     
    },
    itemIcon: {
        width: 150,
        height: 150
    },
    description: {
        textAlign: 'center',
        fontSize: 15,
        marginTop: 25
    },
    navButton: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navText: {
        fontSize: 17
    }
});

export default IntroSlider;
