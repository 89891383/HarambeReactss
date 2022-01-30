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
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3)",
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

	const handlePlayScreenMobile = () => {
		socket.emit("canPlay");
	};

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

	const handleTogglePlayServer = () => {
		if (!admin) {
			return socket.emit("canPlay");
		}

		socket.emit("togglePlay", nickname);
	};

	const handleToggleChat = () => {
		dispatch(hiddenChatToggle());
	};

	const handleSkipVideo = () => {
		if (admin) {
			socket.emit("skipVideo", { nickname });
		}
	};

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
					<Box className={classes.box} onClick={handleToggleChat}>
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

			<div className="controls" ref={controlsRef}>
				<div className="lowerControls">
					<div className="playButton">
						<Box className={classes.box} onClick={handleTogglePlayServer}>
							{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
						</Box>
					</div>

					{/* SKIP ONLY FOR ADMINS */}
					{admin && (
						<div className="skipButton">
							<Box onClick={handleSkipVideo} className={classes.box}>
								<SkipNextIcon />
							</Box>
						</div>
					)}

					<Volume />

					<Typography className={classes.timer}>{timer}</Typography>

					{
						!isLive && <ProgressBar />
						// IF LIVE PROGRESS BAR IS OFF
					}

					{!isLive && (
						<Typography className={classes.timer}>
							{`${hours}:${minutes}:${seconds}`}
						</Typography>
					)}

					<div className="fullScreen">
						{!isLive && admin && <LiveButton />}

						{!isLive && ( // IF LIVE PLAYBACKRATE IS OFF
							<PlaybackRate />
						)}

						{currentAvailableFormats && <Quality />}

						<Box className={classes.box} onClick={handleFullScreen}>
							<FullscreenIcon />
						</Box>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomPlayer;
