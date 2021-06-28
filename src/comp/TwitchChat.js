import { useContext } from "react";
import { DataContext } from "../App";
import React from "react";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { useEffect,useState } from "react";
import { makeStyles } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
	syncOn:{
		color:'#90be6d'
	},
	syncOff:{
		color:'#f9c74f'
	}
})

const TwitchChat = () => {
	
	const classes = useStyles()

	const { onlineUsers,socket,isServerTime } = useContext(DataContext);
	let websiteURL = window.location.host; // HEROKU HOSTING
	if (websiteURL.includes("localhost")) {
		websiteURL = "localhost";
	}


	const [currentChat, setCurrentChat] = useState('victorowsky_');

	useEffect(()=>{
		socket.on('changeTwitchChatAnswer', (currentChatAnswer)=>{
			if(currentChat !== currentChatAnswer ){
				setCurrentChat(currentChatAnswer)
			}
		})
		socket.emit('getCurrentChat')
		return ()=>{
			socket.off('changeTwitchChatAnswer')
		}
	},[socket, currentChat])


	const syncStatus = isServerTime ? 
	<Tooltip title={'SYNC ON'} enterDelay={0}>
		<CheckCircleIcon className={classes.syncOn} />
	</Tooltip> 
	: <Tooltip title={'SYNC OFF'} enterDelay={0}>
		<ErrorIcon className={classes.syncOff} />
	</Tooltip> 

	
	return (
			<div className="twitchChat">
				<span className="onlineUsers">
					{onlineUsers ? `${onlineUsers} ONLINE` : "CONNECTING"}
				</span>
				<span className="syncStatus">
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
