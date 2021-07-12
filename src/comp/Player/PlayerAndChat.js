import React, { useCallback, useContext } from "react";
import { useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { CSSTransition } from "react-transition-group";
import { DataContext } from "../../App";
import CustomPlayer from "./CustomPlayer/CustomPlayer";
import "./PlayerAndChat.css";
import { useIdle } from 'react-use';
import { CircularProgress } from '@material-ui/core';

import AlternativePlayer from "./AlternativePlayer";
import { useDispatch, useSelector } from "react-redux";
import { changeiFrame, changeIsLoading, changeOnlineUsers, changePlaybackRate, changePlaying, changeServerTime, isLiveToggle, joinRoomAnswer, onProgress, playlistToggle, queueDelete, updateQueueYoutubeDL, queueMoveUpAnswer, queueUpdate, setAreControls, setDuration, successMessage, videoChangeAnswer, warningMessage, updateCurrentVideo } from "../../redux/playerState";


const PlayerAndChat = () => {

	const { isPlaying, iFrame, currentVideoLink, admin, playbackRate, isLive, areControls, duration, videoProgress, volume,nickname, maxDelay, isLoading} = useSelector(state => state.player)

	const dispatch = useDispatch()

	const currentRoom = "main";
	const {
		socket,
	} = useContext(DataContext);


	const playerWrapperRef = useRef(null)
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
			dispatch(changeOnlineUsers(onlineUsers))
		});

		socket.on(
			"joinRoomAnswer",
			(serverAnswer) => {

				dispatch(joinRoomAnswer(serverAnswer))

			}
		);

		
			socket.on("serverTimeAnswer", ({ currentSeconds }) => {
				synchronizeVideo(player, currentSeconds);
			});
			socket.on("isPlayingAnswer", ({ isPlaying }) => {
				dispatch(changePlaying(isPlaying))
			});
		

		socket.on('changeTimeAnswer', currentSeconds=>{
			synchronizeVideo(player,currentSeconds)
		})

		socket.on('serverTimeToggleAnswer', ({isServerTime, message})=>{
			if(isServerTime){
				dispatch(successMessage(message))
			}else{
				dispatch(warningMessage(message))
			}
			dispatch(changeServerTime(isServerTime))

		})

		socket.on("videoChangeAnswer", (answer) => {
			dispatch(videoChangeAnswer(answer))
		});

		socket.on("queueUpdateAnswer", (serverQueueUpdate) => {
			dispatch(queueUpdate(serverQueueUpdate))
		});

		socket.on('updateQueueYoutubeDL', ({link,duration,thumbnail, title,formats,id, noData})=>{
			dispatch(updateQueueYoutubeDL({link,duration,thumbnail, title,id,formats, noData}))
		})

		socket.on('updateCurrentVideoYoutubeDL', (answer)=>{
			dispatch(updateCurrentVideo(answer))
		})

		socket.on('queueMoveUpAnswer', (queueAnswer)=>{
			dispatch(queueMoveUpAnswer(queueAnswer))
		})

		socket.on("queueDeleteAnswer", (idToDelete) => {
			dispatch(queueDelete(idToDelete))
		});

		socket.on("playlistToggleAnswer", ({ isOpen }) => {
			dispatch(playlistToggle(isOpen))
		});

		
		socket.on('playbackRateAnswer', (answer)=>{
			dispatch(changePlaybackRate(answer))
		})


		socket.on('iFrameToggleAnswer', ({iFrameAnswer})=>{
			dispatch(changeiFrame(iFrameAnswer))
		})

		socket.on('liveVideoAnswer', ()=>{
			dispatch(isLiveToggle(true))
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
			socket.off('serverTimeToggleAnswer')
			socket.off('updateQueueYoutubeDL')
			socket.off('updateCurrentVideoYoutubeDL')
		};
		// eslint-disable-next-line
	}, [currentRoom, admin, socket, maxDelay, nickname]);


	const videoDuration = (duration) => {
		socket.emit("videoDuration", { duration });
		dispatch(setDuration(duration))
		if(duration === Infinity && !isLive){
			dispatch(isLiveToggle(true))
			socket.emit('liveVideo')
		}
	};



	const isIdle = useIdle(1000 * 3) // REACT-USE

	useEffect(()=>{
		if(isIdle && areControls){
			dispatch(setAreControls(false))
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
		dispatch(setAreControls(true))
	}
	const handleHideControls = () =>{
		if(areControls){
			dispatch(setAreControls(false))
		}
	}

	const setLiveDuration = (currentProgress) =>{

		if(!currentProgress) return false
		const {playedSeconds, played} = currentProgress
		if(playedSeconds && played){
			const liveDuration  = Math.floor(playedSeconds/played)
			if(liveDuration !== duration ){
				if(duration - 2 > liveDuration || duration + 2 < liveDuration){
					dispatch(setDuration(liveDuration))
					synchronizeVideo(player, liveDuration - 3)
					if(!isLive){
						dispatch(isLiveToggle(true))
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
								if(videoProgress !== e && !isLive){
									setLiveDuration(e) // FUNCTION
								}
								if(!isLive){
									dispatch(onProgress(e))
								}
							}}
							playing={isPlaying}
							className="react-player"
							url={currentVideoLink}
							width="100%"
							height="100%"
							controls={false}
							muted={false}
							volume={volume}
							playbackRate={playbackRate}
							onReady={()=>dispatch(changeIsLoading(false))}
							onBuffer={()=>dispatch(changeIsLoading(true))}
							onBufferEnd={()=> dispatch(changeIsLoading(false))}
						/>
				
					<CSSTransition 
							unmountOnExit 
							in={areControls}
							timeout={200} 
							classNames='controls'>
							<CustomPlayer
								playerWrapperRef={playerWrapperRef}
							
								/>
					</CSSTransition>

						{/* LOADING IS OUT OF CUSTOM PLAYER TO BE SEEN IF IT IS HIDDEN */}
						{isLoading && currentVideoLink && <div 	className="loading">
						<CircularProgress size={60} />
						</div>} 

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
