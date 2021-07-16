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
// import Options from "./comp/AdminPanel/Options/Options";
import OptionsDialog from "./comp/AdminPanel/Options/OptionsDialog";
// import Profile from "./comp/Profile/Profile";
// import History from "./comp/History/History";
import HistoryDialog from "./comp/History/HistoryDialog";
import {  useDispatch, useSelector } from 'react-redux'

import { changeNickname, errorMessage, setTwitchUserData, successMessage, warningMessage } from "./redux/playerState";
import ClickToLoad from "./comp/Player/ClickToLoad";
export const DataContext = React.createContext();

const socket = io(`/`);


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
			<DataContext.Provider
				value={{
					websiteURL,		
					socket,
					history,
				}}
			>
				<div className="app">
					<div className="playerAndControls">

					{firstInteraction ? <PlayerAndChat/> : <ClickToLoad/>}
						{/* <ClickToLoad/>
						<PlayerAndChat /> */}
						<div className="bottomDiv">
							<AdminPanel />
						</div>
					</div>
					<HistoryDialog />
					{!hiddenChat && <TwitchChat />}	
					<OptionsDialog />
				</div>
				<Success />
				<Error />
				<Warning />
			</DataContext.Provider>
	);
};

export default App;
