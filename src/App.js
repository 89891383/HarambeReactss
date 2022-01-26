import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import AdminPanel from "./comp/AdminPanel/AdminPanel";
import PlayerAndChat from "./comp/Player/PlayerAndChat";
import Alert from "./comp/Snackbars/Alert";
import TwitchChat from "./comp/TwitchChat";
import { useDispatch, useSelector } from "react-redux";
import {
	changeNickname,
	handleDisconnect,
	handleReconnect,
	setTwitchUserData,
} from "./redux/playerState";
import ClickToLoad from "./comp/Player/ClickToLoad";
import { createTheme, ThemeProvider, makeStyles, Box } from "@material-ui/core";
import TwitchCam from "./comp/TwitchCam/TwitchCam";

import Poll from "./comp/Poll/Poll";
import { setAlert } from "./redux/alertSlice";
import { getProfile } from "./api";
import Popouts from "./comp/Popouts";
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

const useStyles = makeStyles({
	app: {
		display: "flex",
		textAlign: "center",
		justifyItems: "center",
		width: "100%",
		height: "100vh",
		color: "white",
		"@media(max-width:720px)": {
			display: "flex",
			flexDirection: "column",
			height: "fit-content",
		},
	},
	player: {
		width: "100%",
		height: "100vh",
		overflow: "scroll",
		position: "relative",
		"@media(max-width:720px)": {
			height: "fit-content",
			overflow: "scroll",
		},
	},
});

const App = () => {
	const history = useHistory();

	const { hiddenChat, firstInteraction, isTwitchCam } = useSelector(
		(state) => state.player
	);

	const dispatch = useDispatch();

	const classes = useStyles();

	const websiteURL = window.location.origin;

	// APP, ADMINPANEL, PLAYERANDCHAT, PACKAGE.JSON

	useEffect(() => {
		getProfile()
			.then((res) => {
				if (res.profile) {
					dispatch(setTwitchUserData(res.profile));
					dispatch(changeNickname(res.profile.login.toLowerCase()));
				}
			})
			.catch((err) =>
				dispatch(setAlert({ message: "Get profile error", type: "error" }))
			);
	}, [dispatch]);

	useEffect(() => {
		socket.on("alert", (payload) => {
			dispatch(setAlert(payload));
		});
		socket.on("disconnect", () => {
			dispatch(handleDisconnect());
		});

		socket.io.on("reconnect", () => {
			dispatch(handleReconnect());
		});

		return () => {
			socket.off("alert");
			socket.off("disconnect");
			socket.off("reconnect");
		};
	}, [dispatch]);

	return (
		<ThemeProvider theme={theme}>
			<DataContext.Provider
				value={{
					websiteURL,
					socket,
					history,
				}}
			>
				<Box className={classes.app}>
					<Box className={classes.player}>
						{firstInteraction ? (
							<>
								<PlayerAndChat />
								<AdminPanel />
							</>
						) : (
							<ClickToLoad />
						)}
					</Box>

					<Popouts />
					{!hiddenChat && <TwitchChat />}
					{isTwitchCam && firstInteraction && <TwitchCam />}
				</Box>
				<Poll />
				<Alert />
			</DataContext.Provider>
		</ThemeProvider>
	);
};

export default App;
