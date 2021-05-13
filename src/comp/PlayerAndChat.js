import React, { useContext } from "react";
import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { DataContext } from "../App";
import "./PlayerAndChat.css";

const PlayerAndChat = () => {
	const currentRoom = "main";
	const {
		admin,
		setCurrentVideoLink,
		currentVideoLink,
		socket,
		setAdmin,
		videoQueue,
		setVideoQueue,
		maxDelay,
		timeAdmin,
		nickname,
		setNicknameOfTimeAdmin,
		setIsWarning,
		setWarningMessage,
		setOnlineUsers,
		setIsServerTime,
		videoTitle,
		setVideoTitle,
		setIsPlaylistOpen,
		setIsSuccess,
		setSuccessMessage,
	} = useContext(DataContext);

	const [isPlaying, setIsPlaying] = useState(false);
	const player = useRef(null);
	const maxDelayLive = 6;
	// CHAT LINK

	const synchronizeVideo = (player, currentSeconds) => {
		if (player.current) {
			const videoDuration = player.current.getDuration();
			const currentTime = player.current.getCurrentTime();
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

	// ADMIN EMITS HIS DATA TO SHARE WITH OTHERS
	useEffect(() => {
		let interval;
		if (timeAdmin) {
			interval = setInterval(() => {
				socket.emit(`timeAdmin`, {
					currentSeconds: player.current.getCurrentTime(),
				});
			}, 3000);
		}
		return () => {
			clearInterval(interval);
		};
	}, [timeAdmin, socket, currentRoom, videoQueue, nickname]);

	// JOINING TO ROOM
	useEffect(() => {
		socket.emit(`joinRoom`, { currentRoom, nickname });
	}, [currentRoom, nickname, socket]);

	// SOCKETS LISTENERS FOR USERS ONLY
	useEffect(() => {
		socket.on("onlineUsersAnswer", ({ onlineUsers }) => {
			setOnlineUsers(onlineUsers);
		});

		socket.on(
			"joinRoomAnswer",
			({
				currentVideo,
				queue,
				timeAdmin,
				title,
				isAdmin,
				isServerTime,
				isPlaylistOpen,
			}) => {
				if (isAdmin) {
					setAdmin(isAdmin);
				}
				setCurrentVideoLink(currentVideo);
				setVideoQueue(queue);
				setNicknameOfTimeAdmin(timeAdmin);
				setIsServerTime(isServerTime);
				setIsPlaylistOpen(isPlaylistOpen);
				if (title) {
					setVideoTitle(title);
					document.title = title;
				} else {
					setVideoTitle(null);
					document.title = "Harambe Films";
				}
			}
		);

		if (!timeAdmin) {
			socket.on("serverTimeAnswer", ({ currentSeconds }) => {
				synchronizeVideo(player, currentSeconds);
			});
			socket.on("isPlayingAnswer", ({ isPlaying }) => {
				setIsPlaying(isPlaying);
			});
		}

		socket.on("timeAdminIsEmpty", ({ message }) => {
			setIsWarning(true);
			setWarningMessage(message);
			setNicknameOfTimeAdmin(null);
			setIsPlaying(false);
		});

		socket.on("videoChangeAnswer", ({ currentVideoLink, queue, title }) => {
			// TURNED OFF FOR ADMIN TO NOT LOOP PAGE
			setCurrentVideoLink(currentVideoLink);
			setVideoQueue(queue);
			if (title) {
				setVideoTitle(title);
				document.title = title;
			} else {
				setVideoTitle(null);
				document.title = "Harambe Films";
			}
		});

		socket.on("queueUpdateAnswer", (serverQueueUpdate) => {
			setVideoQueue((prev) => [...prev, serverQueueUpdate]);
		});
		socket.on("queueDeleteAnswer", (URLToDelete) => {
			setVideoQueue((prev) => {
				let newQueue = prev.filter((video) => video.URL !== URLToDelete);
				return newQueue;
			});
		});

		socket.on("playlistToggleAnswer", ({ isOpen }) => {
			setIsPlaylistOpen(isOpen);
			if (isOpen) {
				setIsSuccess(true);
				setSuccessMessage("PLAYLIST IS NOW OPEN");
			} else {
				setIsWarning(true);
				setWarningMessage("PLAYLIST IS NOW CLOSED");
			}
		});

		return () => {
			socket.removeAllListeners(`adminDataAnswer`);
			socket.removeAllListeners(`joinRoomAnswer`);
			socket.removeAllListeners(`videoChangeAnswer`);
			socket.removeAllListeners("queueUpdateAnswer");
			socket.removeAllListeners("onlineUsersAnswer");
			socket.removeAllListeners("isPlayingAnswer");
			socket.removeAllListeners("serverTimeAnswer");
			socket.removeAllListeners("timeAdminLeftAnnounce");
			socket.removeAllListeners("getVideoDuration");
			socket.removeAllListeners("queueDeleteAnswer");
			socket.removeAllListeners("playlistToggleAnswer");
		};
		// eslint-disable-next-line
	}, [currentRoom, admin, socket, maxDelay, nickname, timeAdmin]);

	const startSendingTimeToSocket = () => {
		// AVAILABLE ONLY FOR ADMIN
		if (timeAdmin) {
			setIsPlaying(true);
			socket.emit("isPlaying", {
				isPlaying: true,
			});
		}
	};

	const stopSendingTimeToSocket = () => {
		// AVAILABLE ONLY FOR ADMIN
		if (timeAdmin) {
			setIsPlaying(false);
			socket.emit("isPlaying", {
				isPlaying: false,
			});
		}
	};

	const videoDuration = (duration) => {
		socket.emit("videoDuration", { duration });
	};

	return (
		<>
			<div className="playerAndChat">
				<div className="player-wrapper">
					<ReactPlayer
						ref={player}
						onPlay={startSendingTimeToSocket}
						onPause={stopSendingTimeToSocket}
						onDuration={videoDuration}
						playing={isPlaying}
						// onEnded={nextVideo}
						className="react-player"
						url={currentVideoLink}
						width="100%"
						height="100%"
						controls={true}
						volume={0.1}
					/>
				</div>
			</div>
			{videoTitle && <div className="videoTitle">{videoTitle}</div>}
		</>
	);
};

export default PlayerAndChat;
