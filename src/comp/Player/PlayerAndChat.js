import React, { useCallback, useContext } from "react";
import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { CSSTransition } from "react-transition-group";
import { DataContext } from "../../App";
import CustomPlayer from "./CustomPlayer/CustomPlayer";
import "./PlayerAndChat.css";
import { useIdle } from 'react-use';
import AlternativePlayer from "./AlternativePlayer";


const PlayerAndChat = () => {

	const currentRoom = "main";
	const {
		admin,
		setCurrentVideoLink,
		currentVideoLink,
		socket,
		setAdmin,
		setVideoQueue,
		maxDelay,
		nickname,
		setIsWarning,
		setWarningMessage,
		setOnlineUsers,
		setIsServerTime,
		setVideoTitle,
		setIsPlaylistOpen,
		setIsSuccess,
		setSuccessMessage,
		iFrame, 
		setiFrame,
	} = useContext(DataContext);


	const playerWrapperRef = useRef(null)

	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(0.1);
	const [areControls, setAreControls] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [videoProgress, setVideoProgress] = useState(null);
	const [isLive, setIsLive] = useState(false);
	const player = useRef(null);
	const maxDelayLive = 6;
	// CHAT LINK

	const synchronizeVideo = (player, currentSeconds) => {
		if (player.current) {
			const videoDuration = player.current.getDuration();
			const currentTime = player.current.getCurrentTime();
			if(!currentTime) return false
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
				title,
				isAdmin,
				isServerTime,
				isPlaylistOpen,
				isPlaying,
				playbackRate,
				iframe,
				isLive,
			}) => {
				if (isAdmin) {
					setAdmin(isAdmin);
				}
				setiFrame(iframe)
				setPlaybackRate(playbackRate)
				setCurrentVideoLink(currentVideo);
				setVideoQueue(queue);
				setIsServerTime(isServerTime);
				setIsPlaylistOpen(isPlaylistOpen);
				setIsPlaying(isPlaying)
				setIsLive(isLive)
				if (title) {
					setVideoTitle(title);
					document.title = title;
				} else {
					setVideoTitle(null);
					document.title = "Legga";
				}
			}
		);

		
			socket.on("serverTimeAnswer", ({ currentSeconds }) => {
				synchronizeVideo(player, currentSeconds);
			});
			socket.on("isPlayingAnswer", ({ isPlaying }) => {
				setIsPlaying(isPlaying);
			});
		

		socket.on('changeTimeAnswer', currentSeconds=>{
			synchronizeVideo(player,currentSeconds)
		})

		socket.on('serverTimeToggleAnswer', ({isServerTime, message})=>{
			if(isServerTime){
				setIsSuccess(true)
				setSuccessMessage(message)
			}else{
				setIsWarning(true)
				setWarningMessage(message)
			}
			setIsServerTime(isServerTime)

		})

		socket.on("videoChangeAnswer", ({ currentVideoLink, queue, title }) => {
			setDuration(0)
			setProgress(0)
			setIsLoading(true)
			setIsLive(false)
			setCurrentVideoLink(currentVideoLink);
			setVideoQueue(queue);
			if (title) {
				setVideoTitle(title);
				document.title = title;
			} else {
				setVideoTitle(null);
				document.title = "Legga";
			}
		});

		socket.on("queueUpdateAnswer", (serverQueueUpdate) => {
			setVideoQueue((prev) => [...prev, serverQueueUpdate]);
		});

		socket.on('queueMoveUpAnswer', (queueAnswer)=>{
			setVideoQueue(queueAnswer)
		})

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

		
		socket.on('playbackRateAnswer', (answer)=>{
				setPlaybackRate(answer)
		})


		socket.on('iFrameToggleAnswer', ({iFrameAnswer})=>{
			setiFrame(iFrameAnswer)
		})

		socket.on('liveVideoAnswer', ()=>{
			setIsLive(true)
			console.log('LIVE VIDEO SET');
		})


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
			socket.off('changeTimeAnswer')	
			socket.off('playbackRateAnswer')	
			socket.off('iFrameToggleAnswer')
			socket.off('queueMoveUpAnswer')	
			socket.off('liveVideoAnswer')	
		};
		// eslint-disable-next-line
	}, [currentRoom, admin, socket, maxDelay, nickname]);


	const videoDuration = (duration) => {
		socket.emit("videoDuration", { duration });
		setDuration(duration)
		if(duration === Infinity && !isLive){
			setIsLive(true)
			socket.emit('liveVideo')
		}
	};



	const isIdle = useIdle(1000 * 3) // REACT-USE

	useEffect(()=>{
		if(isIdle && areControls){
			setAreControls(false)
			const customPlayer = document.querySelector('.customPlayer')
			if(customPlayer){
				customPlayer.style.cursor = 'none'
			}
		}

		// eslint-disable-next-line
	},[isIdle])

	const handleShowControls = () =>{
		if(areControls) return false

		const customPlayer = document.querySelector('.customPlayer')
		if(customPlayer){
			customPlayer.style.cursor = 'initial'
		}
		setAreControls(true)
	}
	const handleHideControls = () =>{
		if(areControls){
			setAreControls(false)
		}
	}

	const setLiveDuration = (currentProgress) =>{

		if(!currentProgress) return false
		const {playedSeconds, played} = currentProgress
		if(playedSeconds && played){
			const liveDuration  = Math.floor(playedSeconds/played)
			if(liveDuration !== duration ){
				if(duration - 2 > liveDuration || duration + 2 < liveDuration){
					setDuration(liveDuration)
					synchronizeVideo(player, liveDuration - 3)
					if(!isLive){
						setIsLive(true)
						socket.emit('liveVideo')
					}
				}
			}
		}
	}


	const secondsForward = useCallback((e) =>{
		if(!admin || !currentVideoLink) return false
		if(e.which === 39){
			socket.emit('secondsForward')
		}
	},[admin,socket,currentVideoLink])
	const secondsBackward = useCallback((e) =>{
		if(!admin || !currentVideoLink) return false
		if(e.which === 37){
			socket.emit('secondsBackward')
		}
	},[admin,socket,currentVideoLink])

	useEffect(()=>{
		document.addEventListener('keydown', secondsForward)
		document.addEventListener('keydown', secondsBackward)

		return ()=>{
			document.removeEventListener('keydown', secondsForward)
			document.removeEventListener('keydown', secondsBackward)
		}

	},[secondsForward,secondsBackward])




	return (
		<>
			<div className="playerAndChat">
				{!iFrame ?  <div 
					className="player-wrapper" 
					onMouseMove={handleShowControls} 
					onMouseLeave={handleHideControls}
					ref={playerWrapperRef}>
						<ReactPlayer
							ref={player}
							onDuration={videoDuration}
							onProgress={(e)=>{
								if(videoProgress !== e){
									setVideoProgress(e)
									setLiveDuration(e)
								}
								setProgress(e.playedSeconds)}}
							playing={isPlaying}
							className="react-player"
							url={currentVideoLink}
							width="100%"
							height="100%"
							controls={false}
							muted={false}
							volume={volume}
							playbackRate={playbackRate}
							onReady={()=>setIsLoading(false)}
							onBuffer={()=>setIsLoading(true)}
							onBufferEnd={()=> setIsLoading(false)}
						/>
				
					<CSSTransition 
							unmountOnExit 
							in={areControls}
							timeout={200} 
							classNames='controls'>
							<CustomPlayer
								player={player}
								setIsPlaying={setIsPlaying}
								isPlaying={isPlaying}
								progress={progress} 
								duration={duration} 
								setVolume={setVolume}
								videoProgress={videoProgress}
								volume={volume}
								playbackRate={playbackRate}
								playerWrapperRef={playerWrapperRef}
								isLoading={isLoading}
								isLive={isLive}
								/>
						</CSSTransition>
				</div>

				:
			
							<AlternativePlayer 
							currentVideoLink={currentVideoLink} />
				}
				

			</div>
		</>
	);
};

export default PlayerAndChat;
