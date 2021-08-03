import React from "react";
import { useContext, useState } from "react";
import { DataContext } from "../../App";
import Popout from "../Popout";
import "./AdminPanel.css";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import QueueIcon from "@material-ui/icons/Queue";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, makeStyles, TextField, Typography } from "@material-ui/core";
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
	},
	button:{
		color:'white',
		fontWeight:'500',
		borderColor:"white",
		"&:hover":{
			borderColor:'white'
		},
		"@media(max-width:600px)":{
			fontSize:'10px'
		}
	},
	groupButton:{
		marginTop:'15px',
		display:'flex',
		justifyContent:'center'
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
		<Popout 
		state={isAddVideo} 
		setState={()=> dispatch(changeIsAddVideo(false))}
		>
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
	
						<ButtonGroup variant="outlined"
						className={classes.groupButton} >

							{ admin && 
							<Button 
							onClick={handleAddVideo} 
							startIcon={<PlayArrowIcon/>} 
							className={classes.button}
							>
								PLAY NOW
							</Button>
							}

							<Button 
							startIcon={<QueueIcon/>}
							onClick={handleAddVideoToQueue} 
							className={classes.button}

							>
								ADD TO QUEUE 
							</Button>

							{admin && 
							<Button 
							startIcon={<SkipNextIcon/>} 
							onClick={handleSkipVideo}
							className={classes.button}

							>
								SKIP VIDEO
							</Button>
							}
						</ButtonGroup>
				
			</form>
		</Popout>
	);
};

export default AddVideo;
