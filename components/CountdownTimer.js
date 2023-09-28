import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import Variables from '../constants/Variables';


const CountdownTimer = props => {

	const [remainingTimeText, setRemainingTimeText] = useState('');
	const [timerDefined, setTimerDefined] = useState(false);
	//const [timer, setTimer] = useState();
	//const [remainingSeconds, setRemainingSeconds] = useState(0);

	let remainingSeconds = 0;
	let timer = undefined;

	useEffect(() => {
		//setRemainingSeconds(props.totalSeconds);
		if (props.requireTimerStop) {
			if (timer != null) {
				clearInterval(timer);
			}
		}
		else {
			remainingSeconds = props.totalSeconds;
			if (!timerDefined) {
				timer = setInterval(() => {
					startCountdown();
				}, 1000);
				setTimerDefined(true);
			}
		}
	}, [props])


	useEffect(() => {
		return () => {
			if (timer != null) {
				clearInterval(timer);
			}
		};
	}, [])


	const startCountdown = () => {
		//console.log(remainingSeconds);
		if (remainingSeconds <= 0) {
			if (timer != null) {
				clearInterval(timer);
				//setTimer(undefined);
			}
			props.onTimeFinished();
			return;
		}
		//setRemainingSeconds((remainingSeconds) => remainingSeconds - 1);
		remainingSeconds--;
		const hrs = Math.floor(remainingSeconds / 60 / 60);
		const min = Math.floor(remainingSeconds / 60) - (hrs * 60);
		const sec = remainingSeconds % 60;
		const formatted = hrs.toString().padStart(2, '0') + ':' + min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
		setRemainingTimeText(formatted);
		Variables.RemainingSeconds = remainingSeconds;
	}


	return (
		<Text>{props.totalSeconds > 0 ? "Time Left: " + remainingTimeText : ""}</Text>
	)

}


export default CountdownTimer;