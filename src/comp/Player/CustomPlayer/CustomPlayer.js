import React, { useCallback } from "react";
import "./CustomPlayer.css";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import { Box, makeStyles, Typography } from "@material-ui/core";
import ShowChat from "@material-ui/icons/SpeakerNotesOff";
import HideChat from "@material-ui/icons/Chat";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import { useContext } from "react";
import { DataContext } from "../../../App";
import { useRef, useEffect, useState } from "react";
import Volume from "./Volume";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import PlaybackRate from "./PlaybackRate";
import Forward5Icon from "@material-ui/icons/Forward5";
import Replay5Icon from "@material-ui/icons/Replay5";
import ProgressBar from "./ProgressBar";
import LiveButton from "./LiveButton";
import { useDispatch, useSelector } from "react-redux";
import { hiddenChatToggle, togglePlaying } from "../../../redux/playerState";
import Quality from "./PlayerSettings/Quality";
import { isMobile, MobileView } from "react-device-detect";
import Title from "./Title";
import TwitchCamToggle from "./TwitchCamToggle";
import useTime from "../../../Hooks/useTime";
import { sharedStyles } from "../../../shared/styles";

const screenfull = require("screenfull");

const useStyles = makeStyles({
	playButton: {
		height: "100%",
		width: "auto",
		color: "white",
		transition: "300ms color ease",
		margin: "none",
		"&:hover": {
			color: "rgb(63,81,181)",
		},
	},
	volumeBtn: {
		color: "white",
		width: "48px",
		height: "48px",
		"&:hover": {
			color: "rgb(63,81,181)",
		},
	},
	toggleChat: {
		color: "white",
		backgroundColor: " rgba(0, 0, 0, 0.2)",
		"&:hover": {
			color: "rgb(63,81,181)",
			backgroundColor: " rgba(0, 0, 0, 0.2)",
		},
	},

	skipSeconds: {
		fontSize: "150px",
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%,-50%)",
	},

	mobilePauseVideoButton: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%,-50%)",
		color: "white",
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3);",
		},
	},
	timer: {
		fontWeight: "700",
		"@media (max-width:600px)": {
			display: "none",
		},
	},
	topInfo: {
		display: "flex",
		alignItems: "center",
		position: "absolute",
		top: "0",
		left: "0",
		width: "100%",
		padding: "15px",
	},
	topInfoButtons: {
		display: "flex",
		gap: "10px",
		marginLeft: "auto",
		width: "fit-content",
	},
	controls: {
		width: "100%",
		margin: "0 auto",
		height: "50px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	lowerControls: {
		display: "flex",
		width: "99%",
		alignItems: "center",
		gap: "5px",
		marginTop: "5px",
	},
	fullscreen: {
		marginLeft: "auto",
		display: "flex",
		alignItems: "center",
		gap: "5px;",
	},
});

const mobileToggleIconStyles = {
	fontSize: "60px",
	textShadow: "0 0 10px black",
};

const CustomPlayer = ({ playerWrapperRef }) => {
	const {
		isLive,
		isPlaying,
		progress,
		duration,
		admin,
		hiddenChat,
		currentVideoLink,
		nickname,
		currentAvailableFormats,
	} = useSelector((state) => state.player);

	const dispatch = useDispatch();

	const { socket } = useContext(DataContext);

	const classes = useStyles();

	const [secondsSkip, setSecondsSkip] = useState(false);

	const { seconds, minutes, hours } = useTime(duration);

	const currentTime = useTime(Math.floor(progress));

	const controlsRef = useRef(null);

	const handlePlayScreen = useCallback(
		(e) => {
			if (isMobile) return false;

			if ([...e.target.classList].includes("customPlayer")) {
				socket.emit("canPlay");
			}
		},
		[socket]
	);

	const handlePlayScreenMobile = useCallback(() => {
		socket.emit("canPlay");
	}, [socket]);

	useEffect(() => {
		socket.on("secondsSkipAnswer", ({ type }) => {
			setSecondsSkip(type);
			setTimeout(() => {
				setSecondsSkip(false);
			}, 500);
		});

		return () => {
			socket.off("secondsSkipAnswer");
		};
	}, [socket]);

	useEffect(() => {
		socket.on("canPlayAnswer", (answer) => {
			if (answer) {
				dispatch(togglePlaying());
			}
		});

		return () => {
			socket.off("canPlayAnswer");
		};
	}, [dispatch, socket]);

	const handleFullScreen = () => {
		screenfull.toggle();
	};

	const EscCloseFullScreen = useCallback(() => {
		playerWrapperRef.current.classList.toggle("fullscreenPlayer");
	}, [playerWrapperRef]);

	useEffect(() => {
		document.addEventListener("fullscreenchange", EscCloseFullScreen);

		return () => {
			document.removeEventListener("fullscreenchange", EscCloseFullScreen);
		};
	}, [EscCloseFullScreen]);

	const handleTogglePlayServer = useCallback(() => {
		if (!admin) {
			return socket.emit("canPlay");
		}

		socket.emit("togglePlay", nickname);
	}, [admin, nickname, socket]);

	const handleToggleChat = useCallback(() => {
		dispatch(hiddenChatToggle());
	}, [dispatch]);

	const handleSkipVideo = useCallback(() => {
		if (admin) {
			socket.emit("skipVideo", { nickname });
		}
	}, [admin, nickname, socket]);

	const timer = isLive ? (
		<span className="live">LIVE</span>
	) : (
		`${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds}`
	);

	return (
		<div className="customPlayer" onClick={handlePlayScreen}>
			{/* TOP INFO */}
			<Box className={classes.topInfo}>
				<Title />
				<Box className={classes.topInfoButtons}>
					{admin && <TwitchCamToggle />}
					<Box sx={sharedStyles.box} onClick={handleToggleChat}>
						{!hiddenChat ? <ShowChat /> : <HideChat />}
					</Box>
				</Box>
			</Box>

			{secondsSkip && (
				<div className="secondsSkip">
					{secondsSkip === "FORWARD" ? (
						<Forward5Icon className={classes.skipSeconds} />
					) : (
						<Replay5Icon className={classes.skipSeconds} />
					)}
				</div>
			)}

			{/* BUTTON ONLY FOR MOBILE DEVICES  */}
			<MobileView>
				{currentVideoLink && (
					<Box
						onClick={handlePlayScreenMobile}
						className={classes.mobilePauseVideoButton}
					>
						{isPlaying ? (
							<PauseIcon style={mobileToggleIconStyles} />
						) : (
							<PlayArrowIcon style={mobileToggleIconStyles} />
						)}
					</Box>
				)}
			</MobileView>

			<Box className={classes.controls} ref={controlsRef}>
				<Box className={classes.lowerControls}>
					<Box className="playButton">
						<Box sx={sharedStyles.box} onClick={handleTogglePlayServer}>
							{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
						</Box>
					</Box>

					{/* SKIP ONLY FOR ADMINS */}
					{admin && (
						<Box className="skipButton">
							<Box onClick={handleSkipVideo} sx={sharedStyles.box}>
								<SkipNextIcon />
							</Box>
						</Box>
					)}

					<Volume />

					<Typography className={classes.timer}>{timer}</Typography>

					{
						// IF LIVE PROGRESS BAR IS OFF
						!isLive && <ProgressBar />
					}

					{!isLive && (
						<Typography className={classes.timer}>
							{`${hours}:${minutes}:${seconds}`}
						</Typography>
					)}

					<Box className={classes.fullscreen}>
						{!isLive && admin && <LiveButton />}

						{!isLive && ( // IF LIVE PLAYBACKRATE IS OFF
							<PlaybackRate />
						)}

						{currentAvailableFormats && <Quality />}

						<Box sx={sharedStyles.box} onClick={handleFullScreen}>
							<FullscreenIcon />
						</Box>
					</Box>
				</Box>
			</Box>
		</div>
	);
};

export default CustomPlayer;
