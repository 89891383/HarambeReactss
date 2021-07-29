import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import AdminPanel from "./comp/AdminPanel/AdminPanel";
import PlayerAndChat from "./comp/Player/PlayerAndChat";
import Success from "./comp/Snackbars/Success";
import Error from "./comp/Snackbars/Error";
import Warning from "./comp/Snackbars/Warning";
import TwitchChat from "./comp/TwitchChat";
import OptionsDialog from "./comp/AdminPanel/Options/OptionsDialog";
import HistoryDialog from "./comp/History/HistoryDialog";
import {  useDispatch, useSelector } from 'react-redux'

import { changeNickname, errorMessage, setTwitchUserData, successMessage, warningMessage } from "./redux/playerState";
import ClickToLoad from "./comp/Player/ClickToLoad";
import { createTheme, ThemeProvider } from "@material-ui/core";
export const DataContext = React.createContext();

const socket = io(`/`);

const theme = createTheme({
	overrides:{
		MuiSlider:{
			colorPrimary:'red',
			rail:{
				color:'white'
			},
			track:{
				color:'white'
			},
			thumb:{
				color:'white',
				'&:focus, &:hover, &$active': {
					boxShadow: 'none',
				},
			},
			marked:{
				color:'transparent'
			}
		}
	}

})


const App = () => {

	const history = useHistory();

	const { hiddenChat,firstInteraction } = useSelector(state => state.player)

	const dispatch = useDispatch()


	// const twitchStreamer = "main";
	const websiteURL = window.location.origin;

	// APP, ADMINPANEL, PLAYERANDCHAT, PACKAGE.JSON

	useEffect(() => {
		fetch("/getProfile", { credentials: "include" })
			.then((res) => res.json())
			.then((res) => {
				if (res.profile) {
					dispatch(setTwitchUserData(res.profile))
					dispatch(changeNickname(res.profile.login.toLowerCase()))
				}
			});
	}, [dispatch]);




	useEffect(() => {
		socket.on("success", ({ message }) => {
			dispatch(successMessage(message))
		});
		socket.on("error", ({ message }) => {
			dispatch(errorMessage(message))
		});
		socket.on('warning', ({message})=>{
			dispatch(warningMessage(message))
		})
		return () => {
			socket.off("success");
			socket.off("error");
			socket.off('warning')
		};
	}, [dispatch]);


	return (
		<ThemeProvider theme={theme} >

			<DataContext.Provider
				value={{
					websiteURL,		
					socket,
					history,
				}}
			>
				<div className="app">
					<div className="playerAndControls">

					{firstInteraction ? 
					<>
						<PlayerAndChat/> 
						
						<div className="bottomDiv">
								<AdminPanel />
						</div>
					</>
					
					: <ClickToLoad/>}
						
					</div>
					<HistoryDialog />
					{!hiddenChat && <TwitchChat />}	
					<OptionsDialog />
				</div>
				<Success />
				<Error />
				<Warning />
			</DataContext.Provider>
		</ThemeProvider>

	);
};

export default App;
