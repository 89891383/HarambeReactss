import { useContext } from "react";
import { DataContext } from "../App";
import React from "react";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { useEffect,useState } from "react";
import { makeStyles } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch, useSelector } from "react-redux";
import { changeCurrentChat } from "../redux/playerState";

let pingInterval;

let pingInit;


const useStyles = makeStyles({
	syncOn:{
		color:'#90be6d'
	},
	syncOff:{
		color:'#f9c74f',
		animation:'$breatheEffect infinite 3s ease-in-out'
	},
	'@keyframes breatheEffect':{
		'0%':{
			opacity:'0.6'
		},
		'50%':{
			opacity:'1'
		},
		'100%':{
			opacity:'0.6'
		},
	}
})

const TwitchChat = () => {
	
	const [ping, setPing] = useState(0);

	const classes = useStyles()

	const dispatch = useDispatch()

	const {onlineUsers, isServerTime, currentChat} = useSelector(state=> state.player)

	const { socket } = useContext(DataContext);
	let websiteURL = window.location.host; // HEROKU HOSTING
	if (websiteURL.includes("localhost")) {
		websiteURL = "localhost";
	}


	// const [currentChat, setCurrentChat] = useState('victorowsky_');

	useEffect(()=>{
		socket.on('changeTwitchChatAnswer', (currentChatAnswer)=>{
			if(currentChat !== currentChatAnswer ){
				dispatch(changeCurrentChat(currentChatAnswer))
				// setCurrentChat(currentChatAnswer)
			}
		})
		socket.emit('getCurrentChat')
		return ()=>{
			socket.off('changeTwitchChatAnswer')
		}
	},[socket, currentChat, dispatch])

	const handleCheckPing = () =>{

		// pingInit -> START TIME
		// ping -> RESPONSE FROM SERVER TIME

			pingInit = Date.now()
			socket.emit('ping')

		pingInterval = setInterval(() => {
			pingInit = Date.now()
			socket.emit('ping')
		}, 2000);

	}

	useEffect(()=>{

		// CHECK PING ON LOADPAGE
		pingInit = Date.now()
		socket.emit('ping')
		//

		socket.on('pong', ()=>{
			const ping = Date.now()
			setPing(ping - pingInit)
		})
		return ()=>{
			socket.off('pong')
		}
	},[socket])


	const syncStatus = isServerTime ? 
	<Tooltip title={`SYNC ON, ${ping}ms`} enterDelay={0}>
		<CheckCircleIcon className={classes.syncOn} />
	</Tooltip> 
	: <Tooltip title={`SYNC OFF, ${ping}ms`} enterDelay={0}>
		<ErrorIcon className={classes.syncOff} />
	</Tooltip> 

	
	return (
			<div className="twitchChat">
				<span className="onlineUsers">
					{onlineUsers ? `${onlineUsers} ONLINE` : "CONNECTING"}
				</span>
				<span className="syncStatus" onMouseEnter={handleCheckPing} onMouseLeave={()=> clearInterval(pingInterval)} >
					{syncStatus}
				</span>
				<iframe
					style={{ border: "2px solid #121212" }}
					title="TwitchChat"
					id="chat_embed"
					src={`https://www.twitch.tv/embed/${currentChat}/chat?darkpopout&parent=${websiteURL}`}
					height="100%"
					width="100%"
				></iframe>
			</div>

	);
};

export default TwitchChat;
