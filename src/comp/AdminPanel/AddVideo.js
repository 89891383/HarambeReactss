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
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import { changeIsAddVideo } from "../../redux/playerState";

const useStyles = makeStyles({
	textField:{
		color:'white',
		margin:'10px 0',
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
			  borderColor: 'white',
			},
			'&:hover fieldset': {
				borderColor: '#757ce8',
			  },
			  '&.Mui-focused fieldset': {
				borderColor: '#3f50b5',
			  },
		
		}
	},
	input: {
		color:'white',
	
	},
	inputLabel:{
		color:'white'
	}
})

const AddVideo = () => {

	const classes = useStyles()

	const { admin,nickname, isAddVideo } = useSelector(state=> state.player)

	const { socket } = useContext(DataContext);

	const dispatch = useDispatch()

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
				currentVideoLink: editVideoLink,
				videoTitle,
			});
			setVideoTitle("");
			setEditVideoLink("");
			dispatch(changeIsAddVideo(false))
		}
	};

	const handleAddVideoToQueue = () => {
		if (editVideoLink) {
			socket.emit("queueUpdate", {
				videoLink: editVideoLink,
				nickname,
				videoTitle,
			});
			setEditVideoLink("");
			setVideoTitle("");
			dispatch(changeIsAddVideo(false))
		}
	};

	return (
		<Popout state={isAddVideo} setState={()=> dispatch(changeIsAddVideo(false))}>
			<form className="addVideo_Form">
				<Typography variant="h4" gutterBottom >
					Add your video to queue
				</Typography>
				<hr />
				<div className="inputsDiv">
					<TextField 
						label="Enter video URL"
						value={editVideoLink}
						onChange={(e) => {
							setEditVideoLink(e.target.value);
						}}
						autoComplete="off"
						color="primary"
						inputProps={{
							className:classes.input
						}}
						InputLabelProps={{
							className:classes.inputLabel
						}}
						className={classes.textField}
						variant="outlined"
					/>

					<TextField
						label="Title"
						value={videoTitle}
						autoComplete="off"
						onChange={(e) => {
							setVideoTitle(e.target.value);
						}}
						inputProps={{
							className:classes.input
						}}
						InputLabelProps={{
							className:classes.inputLabel
						}}
						className={classes.textField}
						variant="outlined"
					
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
