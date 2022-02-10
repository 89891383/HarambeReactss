import { useCallback, useContext } from "react";
import { DataContext } from "../App";
import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { useEffect, useState } from "react";
import { makeStyles, Typography, Zoom, Box } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrentChat } from "../redux/playerState";
import colors from "../colors";

let pingInterval;

let pingInit;

const useStyles = makeStyles({
	syncOn: {
		color: colors.green,
	},
	syncOff: {
		color: colors.red,
		animation: "$breatheEffect infinite 3s ease-in-out",
	},
	"@keyframes breatheEffect": {
		"0%": {
			opacity: "0.6",
		},
		"50%": {
			opacity: "1",
		},
		"100%": {
			opacity: "0.6",
		},
	},
	onlineUsers: {
		position: "absolute",
		pointerEvents: "none",
		top: "11px",
		left: "10px",
		color: "grey",
		backgroundColor: colors.backgroundGrey,
		padding: "6px 10px",
		borderRadius: "5px",
		fontWeight: "700",
	},
	disconnected: {
		color: colors.red,
	},
	syncStatus: {
		position: "absolute",
		padding: "5px",
		top: "10px",
		right: "40px",
	},
	twitchChat: {
		position: "relative",
		width: "400px",
		height: "100vh",
		"@media (max-width: 720px)": {
			height: "550px",
			width: "100%",
		},
		"@media screen and (orientation: landscape) and (max-width: 1000px)": {
			width: "300px",
		},
	},
});

const TwitchChat = () => {
	const [ping, setPing] = useState(0);

	const classes = useStyles();

	const dispatch = useDispatch();

	const {
		onlineUsers,
		isServerTime,
		currentChat,
		firstInteraction,
		disconnected,
		hiddenChat,
	} = useSelector((state) => state.player);

	const { socket } = useContext(DataContext);
	let websiteURL = window.location.host; // HEROKU HOSTING
	if (websiteURL.includes("localhost")) {
		websiteURL = "localhost";
	}

	useEffect(() => {
		socket.on("changeTwitchChatAnswer", (currentChatAnswer) => {
			if (currentChat !== currentChatAnswer) {
				dispatch(changeCurrentChat(currentChatAnswer));
			}
		});
		socket.emit("getCurrentChat");
		return () => {
			socket.off("changeTwitchChatAnswer");
		};
	}, [socket, currentChat, dispatch]);

	const handleCheckPing = useCallback(() => {
		// pingInit -> START TIME
		// ping -> RESPONSE FROM SERVER TIME

		pingInit = Date.now();
		socket.emit("ping");

		pingInterval = setInterval(() => {
			pingInit = Date.now();
			socket.emit("ping");
		}, 1000);
	}, [socket]);

	useEffect(() => {
		// CHECK PING ON LOADPAGE
		pingInit = Date.now();
		socket.emit("ping");
		//

		socket.on("pong", () => {
			const ping = Date.now();
			setPing(ping - pingInit);
		});
		return () => {
			socket.off("pong");
		};
	}, [socket]);

	const syncStatus = isServerTime ? (
		<Tooltip
			title={`SYNC ON, ${ping}ms`}
			enterDelay={0}
			TransitionComponent={Zoom}
		>
			<CheckCircleIcon className={classes.syncOn} />
		</Tooltip>
	) : (
		<Tooltip
			title={`SYNC OFF, ${ping}ms`}
			enterDelay={0}
			TransitionComponent={Zoom}
		>
			<ErrorIcon className={classes.syncOff} />
		</Tooltip>
	);

	const disconnectedStatus = () => {
		return (
			<Tooltip title="DISCONNECTED! RELOAD PAGE">
				<ErrorIcon className={classes.disconnected} />
			</Tooltip>
		);
	};

	if (hiddenChat) return false;

	return (
		<Box className={classes.twitchChat}>
			{firstInteraction && (
				<>
					<Typography className={classes.onlineUsers} variant="body2">
						{onlineUsers ? `${onlineUsers} ONLINE` : "CONNECTING"}
					</Typography>

					<Typography
						className={classes.syncStatus}
						onMouseEnter={handleCheckPing}
						onMouseLeave={() => clearInterval(pingInterval)}
					>
						{disconnected ? disconnectedStatus() : syncStatus}
					</Typography>
				</>
			)}

			<iframe
				style={{ border: `2px solid ${colors.backgroundGrey}` }}
				title="TwitchChat"
				id="chat_embed"
				src={`https://www.twitch.tv/embed/${currentChat}/chat?darkpopout&parent=${websiteURL}`}
				height="100%"
				width="100%"
			></iframe>
		</Box>
	);
};

export default TwitchChat;
