import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import AdminPanel from "./comp/AdminPanel/AdminPanel";
import PlayerAndChat from "./comp/PlayerAndChat";
import Success from "./comp/Snackbars/Success";
import Error from "./comp/Snackbars/Error";
import Warning from "./comp/Snackbars/Warning";
// import { useRef } from "react";
import { useMemo } from "react";
import TwitchChat from "./comp/TwitchChat";
import Options from "./comp/AdminPanel/Options/Options";
import OptionsDialog from "./comp/AdminPanel/Options/OptionsDialog";
import Profile from "./comp/Profile/Profile";
export const DataContext = React.createContext();

const socket = io(`/`);

const App = () => {
	const history = useHistory();
	const [admin, setAdmin] = useState(false);
	const [timeAdmin, setTimeAdmin] = useState(false);
	const [currentVideoLink, setCurrentVideoLink] = useState("");
	const [videoQueue, setVideoQueue] = useState([]);
	const [maxDelay, setMaxDelay] = useState(2);
	const [twitchUserData, setTwitchUserData] = useState(null);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [isWarning, setIsWarning] = useState(false);
	const [warningMessage, setWarningMessage] = useState("");
	const [nicknameOfTimeAdmin, setNicknameOfTimeAdmin] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isServerTime, setIsServerTime] = useState(false);
	const [videoTitle, setVideoTitle] = useState(null);
	const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

	const twitchStreamer = "main";
	const websiteURL = window.location.origin;

	let nickname = useMemo(() => {
		return twitchUserData?.login.toLowerCase();
	}, [twitchUserData]);

	// APP, ADMINPANEL, PLAYERANDCHAT, PACKAGE.JSON

	useEffect(() => {
		fetch("/getProfile", { credentials: "include" })
			.then((res) => res.json())
			.then((res) => {
				if (res.profile) {
					setTwitchUserData(res.profile);
				}
			});
	}, []);

	useEffect(() => {
		socket.on("success", ({ message, success }) => {
			setSuccessMessage(message);
			setIsSuccess(success);
		});
		socket.on("error", ({ message }) => {
			setIsError(true);
			setErrorMessage(message);
		});
		return () => {
			socket.off("success");
			socket.off("error");
		};
	}, []);

	return (
		<>
			<DataContext.Provider
				value={{
					websiteURL,
					twitchUserData,
					admin,
					setAdmin,
					socket,
					currentVideoLink,
					setCurrentVideoLink,
					history,
					videoQueue,
					setVideoQueue,
					maxDelay,
					setMaxDelay,
					timeAdmin,
					setTimeAdmin,
					nickname,
					isError,
					setIsError,
					errorMessage,
					setErrorMessage,
					isSuccess,
					setIsSuccess,
					successMessage,
					setSuccessMessage,
					nicknameOfTimeAdmin,
					setNicknameOfTimeAdmin,
					isWarning,
					setIsWarning,
					warningMessage,
					setWarningMessage,
					twitchStreamer,
					onlineUsers,
					setOnlineUsers,
					isDialogOpen,
					setIsDialogOpen,
					isServerTime,
					setIsServerTime,
					videoTitle,
					setVideoTitle,
					isPlaylistOpen,
					setIsPlaylistOpen,
				}}
			>
				<div className="app">
					<div className="playerAndControls">
						<PlayerAndChat />
						<div className="bottomDiv">
							<AdminPanel />
							<div className="sideOptions">
								{twitchUserData && <Profile />}
								{admin && <Options />}
							</div>
						</div>
					</div>
					<TwitchChat />
					<OptionsDialog />
				</div>
				<Success />
				<Error />
				<Warning />
			</DataContext.Provider>
		</>
	);
};

export default App;
