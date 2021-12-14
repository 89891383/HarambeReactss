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
import { useDispatch, useSelector } from "react-redux";

import {
	changeNickname,
	errorMessage,
	handleDisconnect,
	handleReconnect,
	setTwitchUserData,
	successMessage,
	warningMessage,
} from "./redux/playerState";
import ClickToLoad from "./comp/Player/ClickToLoad";
import { createTheme, ThemeProvider } from "@material-ui/core";
import TwitchCam from "./comp/TwitchCam/TwitchCam";
import Popout from "./comp/Popout";
import {
	dialogOpenToggle,
	historyOpenToggle,
	pollOpenToggle,
} from "./redux/popoutsSlice";
import Poll from "./comp/Poll/Poll";
import SetPoll from "./comp/Poll/SetPoll";
export const DataContext = React.createContext();

const socket = io(`/`);

const theme = createTheme({
	palette: {
		type: "dark",
	},
	overrides: {
		MuiSlider: {
			rail: {
				color: "white",
			},
			track: {
				color: "white",
			},
			thumb: {
				color: "white",
				"&:focus, &:hover, &$active": {
					boxShadow: "none",
				},
			},
			marked: {
				color: "transparent",
			},
		},
	},
});

const App = () => {
	const history = useHistory();

	const { hiddenChat, firstInteraction, isTwitchCam } = useSelector(
		(state) => state.player
	);

	const { isHistoryOpen, isDialogOpen, isPollOpen } = useSelector(
		(state) => state.popouts
	);

	const dispatch = useDispatch();

	const websiteURL = window.location.origin;

	// APP, ADMINPANEL, PLAYERANDCHAT, PACKAGE.JSON

	useEffect(() => {
		fetch("/getProfile", { credentials: "include" })
			.then((res) => res.json())
			.then((res) => {
				if (res.profile) {
					dispatch(setTwitchUserData(res.profile));
					dispatch(changeNickname(res.profile.login.toLowerCase()));
				}
			});
	}, [dispatch]);

	useEffect(() => {
		socket.on("success", ({ message }) => {
			dispatch(successMessage(message));
		});
		socket.on("error", ({ message }) => {
			dispatch(errorMessage(message));
		});
		socket.on("warning", ({ message }) => {
			dispatch(warningMessage(message));
		});
		socket.on("disconnect", () => {
			dispatch(handleDisconnect());
		});

		socket.io.on("reconnect", () => {
			dispatch(handleReconnect());
		});

		return () => {
			socket.off("success");
			socket.off("error");
			socket.off("warning");
			socket.off("disconnect");
			socket.off("reconnect");
		};
	}, [dispatch]);

	// useEffect(() => {
	// 	socket.emit("createPoll", { message: "Czy demonzz to debil?" });
	// 	console.log("createPoll");
	// }, []);

	return (
		<ThemeProvider theme={theme}>
			<DataContext.Provider
				value={{
					websiteURL,
					socket,
					history,
				}}
			>
				<div className="app">
					<div className="playerAndControls">
						{firstInteraction ? (
							<>
								<PlayerAndChat />

								<div className="bottomDiv">
									<AdminPanel />
								</div>
							</>
						) : (
							<ClickToLoad />
						)}
					</div>

					<Popout
						state={isHistoryOpen}
						setState={() => dispatch(historyOpenToggle(false))}
					>
						<HistoryDialog />
					</Popout>

					{!hiddenChat && <TwitchChat />}

					<Popout
						state={isDialogOpen}
						setState={() => dispatch(dialogOpenToggle(false))}
					>
						<OptionsDialog />
					</Popout>

					<Popout
						state={isPollOpen}
						setState={() => dispatch(pollOpenToggle(false))}
					>
						<SetPoll />
					</Popout>

					{isTwitchCam && firstInteraction && <TwitchCam />}
				</div>
				<Poll />
				<Success />
				<Error />
				<Warning />
			</DataContext.Provider>
		</ThemeProvider>
	);
};

export default App;
