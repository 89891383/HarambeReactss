import React, { useContext } from "react";
import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { DataContext } from "../App";

const PlayerAndChat = () => {
  const { admin, setCurrentVideoLink, currentVideoLink, socket } = useContext(
    DataContext
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const player = useRef();
  const maxDelay = 2;
  const websiteURL = "localhost"; // FOR TWITCH CHAT

  useEffect(() => {
    if (admin) {
      setInterval(() => {
        socket.emit("currentSeconds", player.current.getCurrentTime());
      }, 3000);
    }
  }, [admin, socket]);

  useEffect(() => {
    if (admin) {
      socket.emit("videoChange", currentVideoLink);
    }
  }, [currentVideoLink, socket, admin]);

  useEffect(() => {
    if (!currentVideoLink) {
      socket.emit("getAllData");
    }
    // eslint-disable-next-line
  }, []);

  socket.on(
    "getAllDataAnswer",
    ({ currentVideoLinkServer, isPlayingServer }) => {
      setCurrentVideoLink(currentVideoLinkServer);
      setIsPlaying(isPlayingServer);
    }
  );

  socket.on("currentSecondsAnswer", (seconds) => {
    if (player.current) {
      const currentTime = player.current.getCurrentTime();
      if (
        !(currentTime < seconds + maxDelay && currentTime > seconds - maxDelay)
      ) {
        player.current.seekTo(seconds, "seconds");
      }
    }
  });

  socket.on("videoChangeAnswer", (currentVideoLink) => {
    if (!admin) {
      setCurrentVideoLink(currentVideoLink);
    }
  });

  const startSendingTimeToSocket = () => {
    if (admin) {
      setIsPlaying(true);
      socket.emit("isPlaying", { isPlaying: true });
    }
  };

  const stopSendingTimeToSocket = () => {
    if (admin) {
      setIsPlaying(false);
      socket.emit("isPlaying", { isPlaying: false });
    }
  };

  socket.on("isPlayingSocketAnswer", (isPlaying) => {
    setIsPlaying(isPlaying);
  });

  socket.on("currentSeconds", ({ time }) => {
    if (player.current) {
      player.current.seekTo(time, "seconds");
    }
  });

  return (
    <div className="videoAndChat">
      <div className="playerAndChat">
        <div className="player-wrapper">
          <ReactPlayer
            ref={player}
            onPlay={startSendingTimeToSocket}
            onPause={stopSendingTimeToSocket}
            playing={isPlaying}
            className="react-player"
            url={currentVideoLink}
            width="100%"
            height="100%"
            controls={true}
            volume={0.1}
          />
        </div>
        <div className="twitchChat">
          <iframe
            style={{ border: "2px solid #121212" }}
            title="TwitchChat"
            id="chat_embed"
            src={`https://www.twitch.tv/embed/demonzz1/chat?parent=${websiteURL}&darkpopout`}
            height="100%"
            width="350"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default PlayerAndChat;
