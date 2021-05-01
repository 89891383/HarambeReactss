import { useContext } from "react";
import { DataContext } from "../App";
import React from "react";
const TwitchChat = () => {
	const { chatRef, websiteURL, onlineUsers } = useContext(DataContext);

	return (
		<div className="twitchChat" ref={chatRef}>
			<span className="onlineUsers">
				{onlineUsers ? `${onlineUsers} ONLINE` : "CONNECTING"}
			</span>
			<iframe
				style={{ border: "2px solid #121212" }}
				title="TwitchChat"
				id="chat_embed"
				// src={`https://www.twitch.tv/embed/demonzz1/chat?darkpopout&parent=${websiteURL}`}
				src={`https://www.twitch.tv/embed/demonzz1/chat?darkpopout&parent=localhost`}
				height="100%"
				width="100%"
			></iframe>
		</div>
	);
};

export default TwitchChat;
