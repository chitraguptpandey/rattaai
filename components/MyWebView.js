import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Button } from 'react-native';

import AutoHeightWebView from 'react-native-autoheight-webview'

import Variables from '../constants/Variables';

const MyWebView = props => {

	const browserWidth = Dimensions.get('window').width - (props.forOption ? 125 : 45);
	const [webViewHeight, setWebViewHeight] = useState(30);
	const [questionLoadCalled, setQuestionLoadCalled] = useState(false);

	const apiUrl = Variables.IsLive ? Variables.LiveApiBaseUrl : Variables.LocalApiBaseUrl;
	const cssUrl = apiUrl + 'dist/assets/app/style.css?v=1.0.3';


	useEffect(() => {
		setQuestionLoadCalled(false);
	}, [props.html])


	const mathJaxDefaultOptions = {
		messageStyle: 'none',
		showMathMenu: false,
		extensions:
			['mml2jax.js', 'MathMenu.js', 'MathZoom.js', 'AssistiveMML.js', 'a11y/accessibility-menu.js',],
		jax: ['input/MathML', 'output/CommonHTML'],
		tex2jax: {
			inlineMath: [['$', '$'], ['\\(', '\\)']],
			displayMath: [['$$', '$$'], ['\\[', '\\]']],
			processEscapes: true,
		},
		TeX: { extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js'], },
		//CommonHTML: { linebreaks: { automatic: true } },
  		//"HTML-CSS": { linebreaks: { automatic: true } },
        // SVG: { linebreaks: { automatic: true } }
	};

	//${props.forOption == undefined || props.forOption === false ? " text-align: justify; " : ""}

	const myCustomStyle = `
							html,body { font-family: 'inter_bold'; font-weight: bold;  overflow-wrap: break-word; color: ${props.textColor != undefined ? props.textColor : "black"} }
                            table { border-collapse: collapse; width: 99%; }
                            td { border: solid 1px black; padding: 5px 10px 5px 10px; }
                            p { font-size: 16px;}
                            * { -webkit-touch-callout:none;
							-webkit-user-select:none;
							-khtml-user-select:none;
							-moz-user-select:none;
							-ms-user-select:none;
							user-select:none; }
							.MathJax_Display, .MJXc-display, .MathJax_SVG_Display {
								overflow-x: auto;
								overflow-y: hidden;
								color: red;
							}
                        `;

	const updateWebViewHeight = (height) => {
		if(props.html == '' && height > 30) {
			setWebViewHeight(30);
		}
		else{
			setWebViewHeight(height);
		}
	}

	const handleMessage = (msg) => {
		if (!questionLoadCalled) {
			setTimeout(() => {
				if (props.onQuestionLoaded) {
					props.onQuestionLoaded();
				}
				setQuestionLoadCalled(true);
			}, 500);
		}
	}

	const wrapMathJax = (content) => {

		const options = JSON.stringify(
			Object.assign({}, mathJaxDefaultOptions)
		);

		return `
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
			<script type="text/x-mathjax-config">
				MathJax.Hub.Config(${options});
				MathJax.Hub.Queue(function() {
					var height = document.documentElement.scrollHeight;
					window.ReactNativeWebView.postMessage(String(height));
					document.getElementById("formula").style.visibility = '';
					document.getElementById("dvTop").style.height = height;
				});
			</script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"></script>
			<div id="dvTop" style="position: absolute; width: 100%; z-index: 100;">
			</div>
			<div id="formula" style="visibility: hidden; font-weight: bold;">
				${content}
			</div>
		`;
	}


	// <MyWebView htmlUrl={"GetQuestionHtml?qid=" + currQues.id + "&lang="  + lang} />

	return (

		<View style={{ height: webViewHeight + 10, ...props.style }}>
			{
				props.htmlUrl != "" && props.htmlUrl != undefined ?
					<AutoHeightWebView
						style={{ width: browserWidth, height: webViewHeight }}
						onSizeUpdated={size => updateWebViewHeight(size.height)}
						source={{ uri: apiUrl + 'api/' + props.htmlUrl }}
						//scalesPageToFit={true}
						viewportContent={'width=device-width, user-scalable=no'}
					/* other react-native-webview props */
					/>
					:
					<AutoHeightWebView
						style={{ width: browserWidth, height: webViewHeight }}
						//customScript={`document.body.style.background = 'red';`}
						customStyle={myCustomStyle}
						onSizeUpdated={size => updateWebViewHeight(size.height)}
						files={[{
							href: cssUrl,
							type: 'text/css',
							rel: 'stylesheet'
						}]}
						source={{ html: props.html.indexOf('MathML', 0) > -1 ? wrapMathJax(props.html) : props.html, baseUrl: apiUrl }}
						onMessage={handleMessage}
						//scalesPageToFit={true}
						viewportContent={'width=device-width, user-scalable=no'}
					/* other react-native-webview props */
					/>
			}
		</View>
	)
}

export default MyWebView;
