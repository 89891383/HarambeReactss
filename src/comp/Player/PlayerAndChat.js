import React, { useCallback, useContext } from "react";
import { useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { DataContext } from "../../App";
import CustomPlayer from "./CustomPlayer/CustomPlayer";
import { useIdle } from "react-use";
import { Box, CircularProgress, Fade } from "@material-ui/core";
import AlternativePlayer from "./AlternativePlayer";
import { useDispatch, useSelector } from "react-redux";
import {
	changeiFrame,
	changeIsLoading,
	changeOnlineUsers,
	changePlaybackRate,
	changePlaying,
	changeServerTime,
	isLiveToggle,
	joinRoomAnswer,
	onProgress,
	playlistToggle,
	queueDelete,
	updateQueueYoutubeDL,
	queueMoveUpAnswer,
	queueUpdate,
	setAreControls,
	setDuration,
	successMessage,
	videoChangeAnswer,
	warningMessage,
	updateCurrentVideo,
	iFrameVideoToggle,
	changeTwitchCam,
	changeHistory,
} from "../../redux/playerState";
import CenterPlayButton from "./CustomPlayer/CenterPlayButton";
import { isMobile } from "react-device-detect";
import { makeStyles } from "@material-ui/styles";
import colors from "../../colors";

const useStyles = makeStyles({
	player: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: `${colors.backgroundGrey}`,
		height: "100vh",
		zIndex: "0",
		position: "relative",
		"@media(max-width:720px)": {
			height: "60vw",
		},
	},
	playerWrapper: {
		height: "100%",
		width: "100%",
		minHeight: "225px",
	},
	reactPlayer: {
		position: "relative",
		top: "0",
		left: "0",
	},
	loading: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%,-50%)",
	},
});

const synchronizeVideo = (player, currentSeconds) => {
	if (player.current) {
		const videoDuration = player.current.getDuration();
		const currentTime = player.current.getCurrentTime();
		const maxDelayLive = 6;
		const maxDelay = 3;

		if (!currentTime) return false;
		// FOR LIVESTREAMS
		if (videoDuration > currentSeconds) {
			// STANDARD VIDEO
			if (
				!(
					currentTime - maxDelay < currentSeconds &&
					currentTime + maxDelay > currentSeconds
				)
			) {
				// MAX 2 SENONDS DIFFERENCE
				player.current.seekTo(currentSeconds, "seconds");
			}
		} else {
			// HERE IS LIVESTREAM VERSION
			if (
				!(
					currentTime < videoDuration + maxDelayLive &&
					currentTime > videoDuration - maxDelayLive
				)
			) {
				player.current.seekTo(videoDuration, "seconds");
			}
		}
	}
};

const PlayerAndChat = () => {
	const {
		isPlaying,
		iFrame,
		currentVideoLink,
		admin,
		playbackRate,
		isLive,
		areControls,
		volume,
		nickname,
		isLoading,
	} = useSelector((state) => state.player);

	const isTwitch = currentVideoLink?.includes("twitch.tv");

	const classes = useStyles(isTwitch);

	const dispatch = useDispatch();

	const currentRoom = "main";
	const { socket } = useContext(DataContext);

	const playerWrapperRef = useRef(null);
	const player = useRef(null);
	// CHAT LINK

	// JOINING TO ROOM
	useEffect(() => {
		socket.emit(`joinRoom`, { currentRoom, nickname });
	}, [currentRoom, nickname, socket]);

	// SOCKETS LISTENERS FOR USERS ONLY
	useEffect(() => {
		socket.on("onlineUsersAnswer", ({ onlineUsers }) => {
			dispatch(changeOnlineUsers(onlineUsers));
		});

		socket.on("joinRoomAnswer", (serverAnswer) => {
			dispatch(joinRoomAnswer(serverAnswer));

			const { timer } = serverAnswer;

			synchronizeVideo(player, timer);
		});

		socket.on("serverTimeAnswer", ({ currentSeconds }) => {
			if (isPlaying) {
				// IF VIDEO IS NOT PLAYING DONT SYNC IT
				synchronizeVideo(player, currentSeconds);
			}
		});
		socket.on("isPlayingAnswer", ({ isPlaying }) => {
			dispatch(changePlaying(isPlaying));
		});

		socket.on("changeTimeAnswer", (currentSeconds) => {
			synchronizeVideo(player, currentSeconds);
		});

		socket.on("serverTimeToggleAnswer", ({ isServerTime, message }) => {
			if (isServerTime) {
				dispatch(successMessage(message));
			} else {
				dispatch(warningMessage(message));
			}
			dispatch(changeServerTime(isServerTime));
		});

		socket.on("videoChangeAnswer", (answer) => {
			dispatch(videoChangeAnswer(answer));
		});

		socket.on("queueUpdateAnswer", (serverQueueUpdate) => {
			dispatch(queueUpdate(serverQueueUpdate));
		});

		socket.on("updateQueueYoutubeDL", (answer) => {
			dispatch(updateQueueYoutubeDL(answer));
		});

		socket.on("updateCurrentVideoYoutubeDL", (answer) => {
			dispatch(updateCurrentVideo(answer));
		});

		socket.on("queueMoveUpAnswer", (queueAnswer) => {
			dispatch(queueMoveUpAnswer(queueAnswer));
		});

		socket.on("queueDeleteAnswer", (idToDelete) => {
			dispatch(queueDelete(idToDelete));
		});

		socket.on("playlistToggleAnswer", ({ isOpen }) => {
			dispatch(playlistToggle(isOpen));
		});

		socket.on("playbackRateAnswer", (answer) => {
			dispatch(changePlaybackRate(answer));
		});

		socket.on("iFrameToggleAnswer", ({ iFrameAnswer }) => {
			dispatch(changeiFrame(iFrameAnswer));
		});

		socket.on("isTwitchCamToggleAnswer", ({ isTwitchCam }) => {
			dispatch(changeTwitchCam(isTwitchCam));
		});

		socket.on("liveVideoAnswer", () => {
			dispatch(isLiveToggle(true));
		});

		socket.on("iFrameVideoToggleAnswer", (answer) => {
			dispatch(iFrameVideoToggle(answer));
		});

		socket.on("getPlaylistHistoryAnswer", ({ history }) => {
			dispatch(changeHistory(history.reverse()));
		});

		return () => {
			socket.off(`joinRoomAnswer`);
			socket.off(`videoChangeAnswer`);
			socket.off("queueUpdateAnswer");
			socket.off("onlineUsersAnswer");
			socket.off("isPlayingAnswer");
			socket.off("serverTimeAnswer");
			socket.off("getVideoDuration");
			socket.off("queueDeleteAnswer");
			socket.off("playlistToggleAnswer");
			socket.off("changeTimeAnswer");
			socket.off("playbackRateAnswer");
			socket.off("iFrameToggleAnswer");
			socket.off("queueMoveUpAnswer");
			socket.off("liveVideoAnswer");
			socket.off("serverTimeToggleAnswer");
			socket.off("updateQueueYoutubeDL");
			socket.off("updateCurrentVideoYoutubeDL");
			socket.off("iFrameVideoToggleAnswer");
			socket.off("isTwitchCamToggleAnswer");
			socket.off("getPlaylistHistoryAnswer");
		};
		// eslint-disable-next-line
	}, [currentRoom, admin, socket, nickname, isPlaying]);

	const videoDuration = useCallback(
		(duration) => {
			socket.emit("videoDuration", { duration });
			dispatch(setDuration(duration));
		},
		[dispatch, socket]
	);

	const isIdle = useIdle(1000 * 3); // REACT-USE

	useEffect(() => {
		if (isIdle && areControls) {
			dispatch(setAreControls(false));
			const customPlayer = document.querySelector(".customPlayer");
			if (customPlayer) {
				customPlayer.style.cursor = "none";
			}
		}
		// eslint-disable-next-line
	}, [isIdle]);

	const handleShowControls = useCallback(() => {
		if (areControls) return false;

		const customPlayer = document.querySelector(".customPlayer");
		if (customPlayer) {
			customPlayer.style.cursor = "initial";
		}
		dispatch(setAreControls(true));
	}, [areControls, dispatch]);

	const handleHideControls = useCallback(() => {
		if (areControls) {
			dispatch(setAreControls(false));
		}
	}, [areControls, dispatch]);

	const handleOnProgress = useCallback(
		(e) => {
			if (!isLive) {
				dispatch(onProgress(e));
			}
		},
		[dispatch, isLive]
	);

	const secondsForward = useCallback(
		(e) => {
			if (!admin || !currentVideoLink) return false;
			if (e.which === 39) {
				socket.emit("secondsForward");
			}
		},
		[admin, socket, currentVideoLink]
	);
	const secondsBackward = useCallback(
		(e) => {
			if (!admin || !currentVideoLink) return false;
			if (e.which === 37) {
				socket.emit("secondsBackward");
			}
		},
		[admin, socket, currentVideoLink]
	);

	useEffect(() => {
		document.addEventListener("keydown", secondsForward);
		document.addEventListener("keydown", secondsBackward);

		return () => {
			document.removeEventListener("keydown", secondsForward);
			document.removeEventListener("keydown", secondsBackward);
		};
	}, [secondsForward, secondsBackward]);

	if (iFrame)
		return (
			//  IFRAME PLAYER
			<Box className={classes.player}>
				<AlternativePlayer />
			</Box>
		);

	return (
		<>
			<Box className={classes.player}>
				<Box
					className={classes.playerWrapper}
					onMouseMove={handleShowControls}
					onMouseLeave={handleHideControls}
					ref={playerWrapperRef}
				>
					<ReactPlayer
						ref={player}
						onDuration={videoDuration}
						onProgress={handleOnProgress}
						playing={isPlaying}
						className={classes.reactPlayer}
						url={currentVideoLink}
						width="100%"
						height="100%"
						style={{ pointerEvents: `${isTwitch ? "auto" : "none"}` }}
						controls={false}
						muted={false}
						volume={volume}
						playbackRate={playbackRate}
						onReady={() => dispatch(changeIsLoading(false))}
						onBuffer={() => dispatch(changeIsLoading(true))}
						onBufferEnd={() => dispatch(changeIsLoading(false))}
					/>

					<Fade in={Boolean(areControls && !isTwitch)} timeout={300}>
						<Box>
							<CustomPlayer playerWrapperRef={playerWrapperRef} />
						</Box>
					</Fade>

					{/* LOADING IS OUT OF CUSTOM PLAYER TO BE SEEN IF IT IS HIDDEN */}
					<Fade in={isLoading && currentVideoLink} unmountOnExit>
						<Box className={classes.loading}>
							<CircularProgress style={{ color: "white" }} size={60} />
						</Box>
					</Fade>

					{/* IF PAUSE PLAY BUTTON IS ON CENTER OF SCREEN |
						 ONLY FOR DESKTOP */}
					<Fade
						in={
							!isPlaying &&
							currentVideoLink &&
							!isLoading &&
							!isMobile &&
							!isTwitch
						}
						timeout={300}
						unmountOnExit
					>
						<Box>
							<CenterPlayButton />
						</Box>
					</Fade>
				</Box>
			</Box>
		</>
	);
};

export default PlayerAndChat;
