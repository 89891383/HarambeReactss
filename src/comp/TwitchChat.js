import { useContext } from "react";
import { DataContext } from "../App";
import React from "react";
import { useEffect,useState } from "react";
const TwitchChat = () => {
	const { onlineUsers,socket } = useContext(DataContext);
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

		return ()=>{
			socket.off('changeTwitchChatAnswer')
		}
	},[socket, currentChat])


	
	return (
		<div className="twitchChat">
			<span className="onlineUsers">
				{onlineUsers ? `${onlineUsers} ONLINE` : "CONNECTING"}
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
