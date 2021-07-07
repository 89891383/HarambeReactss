import React from "react";
import { useContext, useState } from "react";
import { DataContext } from "../../App";
import Popout from "../Popout";
import "./AdminPanel.css";
import QueueButton from "./QueueButton";
import PlayButton from "./PlayButton";
import SkipButton from "./SkipButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import QueueIcon from "@material-ui/icons/Queue";
import { useSelector } from "react-redux";

const AddVideo = ({ isAddVideo, setIsAddVideo }) => {

	const { admin,nickname } = useSelector(state=> state.player)

	const { socket} = useContext(DataContext);

	const [editVideoLink, setEditVideoLink] = useState("");
	const [videoTitle, setVideoTitle] = useState("");

	const handleSkipVideo = () => {
		if (admin) {
			socket.emit("skipVideo", {nickname});
		}
	};

	const handleAddVideo = () => {
		if (editVideoLink) {
			socket.emit("videoChange", {
				currentVideoLink: editVideoLink.toLowerCase(),
				videoTitle,
			});
			setVideoTitle("");
			setEditVideoLink("");
			setIsAddVideo(false);
		}
	};

	const handleAddVideoToQueue = () => {
		if (editVideoLink) {
			socket.emit("queueUpdate", {
				videoLink: editVideoLink.toLowerCase(),
				nickname,
				videoTitle,
			});
			setEditVideoLink("");
			setVideoTitle("");
			setIsAddVideo(false);
		}
	};

	return (
		<Popout state={isAddVideo} setState={setIsAddVideo}>
			<form className="addVideo_Form">
				<h1>ADD VIDEO</h1>
				<hr />
				<div className="inputsDiv">
					<label htmlFor="videoLink">Enter video URL</label>
					<input
						type="text"
						value={editVideoLink}
						placeholder={"URL"}
						autoComplete="off"
						onChange={(e) => {
							setEditVideoLink(e.target.value);
						}}
						name="videoLink"
					/>
					<label htmlFor="videoLink">Enter video title</label>

					<input
						type="text"
						value={videoTitle}
						autoComplete="off"
						placeholder={"TITLE"}
						onChange={(e) => {
							setVideoTitle(e.target.value);
						}}
					/>		
					
				</div>

				<button
					style={{ display: "none" }}
					onClick={(e) => {
						e.preventDefault();
						handleAddVideoToQueue();
					}}
					type="submit"
				></button>
				<div className="optionButtons">
					<div className="controlButtons">
						{admin && (
							<PlayButton onClick={handleAddVideo} title="Play">
								<PlayArrowIcon />
							</PlayButton>
						)}
						<QueueButton onClick={handleAddVideoToQueue} title={"Add to queue"}>
							<QueueIcon />
						</QueueButton>
						{admin && (
							<SkipButton onClick={handleSkipVideo} title={"Skip video"}>
								<SkipNextIcon />
							</SkipButton>
						)}
					</div>
				</div>
			</form>
		</Popout>
	);
};

export default AddVideo;
