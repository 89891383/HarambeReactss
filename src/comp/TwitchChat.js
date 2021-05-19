import { useContext } from "react";
import { DataContext } from "../App";
import React from "react";
const TwitchChat = () => {
	const { onlineUsers } = useContext(DataContext);
	let websiteURL = window.location.host; // HEROKU HOSTING
	if (websiteURL.includes("localhost")) {
		websiteURL = "localhost";
	}

	return (
		<div className="twitchChat">
			<span className="onlineUsers">
				{onlineUsers ? `${onlineUsers} ONLINE` : "CONNECTING"}
			</span>
			<iframe
				style={{ border: "2px solid #121212" }}
				title="TwitchChat"
				id="chat_embed"
				src={`https://www.twitch.tv/embed/demonzz1/chat?darkpopout&parent=${websiteURL}`}
				height="100%"
				width="100%"
			></iframe>
		</div>
	);
};

export default TwitchChat;
