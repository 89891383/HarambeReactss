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
import { Checkbox, makeStyles } from "@material-ui/core";


const useStyles = makeStyles({
	checkbox:{
		width:'fit-content',
	}
})

const AddVideo = ({ isAddVideo, setIsAddVideo }) => {

	const classes = useStyles()

	const { admin, socket, nickname } = useContext(DataContext);

	const [editVideoLink, setEditVideoLink] = useState("");
	const [videoTitle, setVideoTitle] = useState("");
	const [isLive, setIsLive] = useState(false);

	const handleSkipVideo = () => {
		if (admin) {
			socket.emit("skipVideo");
		}
	};

	const handleAddVideo = () => {
		if (editVideoLink) {
			socket.emit("videoChange", {
				currentVideoLink: editVideoLink,
				videoTitle,
				isLive,
			});
			setVideoTitle("");
			setEditVideoLink("");
			setIsAddVideo(false);
			setIsLive(false)
		}
	};

	const handleAddVideoToQueue = () => {
		if (editVideoLink) {
			socket.emit("queueUpdate", {
				videoLink: editVideoLink,
				nickname,
				videoTitle,
				isLive,
			});
			setEditVideoLink("");
			setVideoTitle("");
			setIsAddVideo(false);
			setIsLive(false)
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
					{admin && <div className="isLive">
						<Checkbox color="primary" className={classes.checkbox} checked={isLive} onChange={()=>setIsLive(prev=> !prev)}/>
						<span>LIVE</span>
					</div>}
					
					
					
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
