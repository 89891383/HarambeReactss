import React from "react";
import { useContext, useState } from "react";
import { DataContext } from "../../App";
import "./AdminPanel.css";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import QueueIcon from "@material-ui/icons/Queue";
import { useDispatch, useSelector } from "react-redux";
import {
	Box,
	Button,
	ButtonGroup,
	Checkbox,
	Fade,
	FormControlLabel,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";
import { changeIsAddVideo } from "../../redux/popoutsSlice";

const useStyles = makeStyles({
	textField: {
		margin: "10px 0",
	},
	input: {
		color: "white",
	},
	inputLabel: {
		color: "white",
	},
	button: {
		color: "white",
		fontWeight: "500",
		borderColor: "white",
		"&:hover": {
			borderColor: "white",
		},
		"@media(max-width:600px)": {
			fontSize: "10px",
		},
	},
	groupButton: {
		marginTop: "15px",
		display: "flex",
		justifyContent: "center",
	},
	imdbBox: {
		display: "flex",
		justifyContent: "start",
		alignItems: "center",
		height: "40px",
	},
	imdbTextField: {
		marginLeft: "auto",
	},
});

const AddVideo = () => {
	const classes = useStyles();

	const { admin, nickname } = useSelector((state) => state.player);

	const { socket } = useContext(DataContext);

	const dispatch = useDispatch();

	const [editVideoLink, setEditVideoLink] = useState("");
	const [videoTitle, setVideoTitle] = useState("");
	const [isImdb, setIsImdb] = useState(false);
	const [imdbID, setImdbID] = useState("");

	const handleSkipVideo = () => {
		if (admin) {
			socket.emit("skipVideo", { nickname });
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
			dispatch(changeIsAddVideo(false));
		}
	};

	const handleAddVideoToQueue = () => {
		if (editVideoLink) {
			socket.emit("queueUpdate", {
				videoLink: editVideoLink,
				nickname,
				videoTitle,
				imdbID,
			});
			setEditVideoLink("");
			setVideoTitle("");
			dispatch(changeIsAddVideo(false));
		}
	};

	return (
		<form className="addVideo_Form">
			<Typography variant="h4" gutterBottom>
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
					className={classes.textField}
					variant="outlined"
				/>
				{admin && (
					<Box className={classes.imdbBox}>
						<FormControlLabel
							control={
								<Checkbox
									color="primary"
									onChange={() => setIsImdb((prev) => !prev)}
									value={isImdb}
								/>
							}
							label="IMDB"
						/>
						<Fade in={isImdb} unmountOnExit timeout={300}>
							<TextField
								className={classes.imdbTextField}
								variant="outlined"
								label="Imdb move ID"
								placeholder="tt0068646"
								value={imdbID}
								onChange={(e) => setImdbID(e.target.value)}
							/>
						</Fade>
					</Box>
				)}
			</div>

			<button
				style={{ display: "none" }}
				onClick={(e) => {
					e.preventDefault();
					handleAddVideoToQueue();
				}}
				type="submit"
			></button>

			<ButtonGroup variant="outlined" className={classes.groupButton}>
				{admin && (
					<Button
						onClick={handleAddVideo}
						startIcon={<PlayArrowIcon />}
						className={classes.button}
					>
						PLAY NOW
					</Button>
				)}

				<Button
					startIcon={<QueueIcon />}
					onClick={handleAddVideoToQueue}
					className={classes.button}
				>
					ADD TO QUEUE
				</Button>

				{admin && (
					<Button
						startIcon={<SkipNextIcon />}
						onClick={handleSkipVideo}
						className={classes.button}
					>
						SKIP VIDEO
					</Button>
				)}
			</ButtonGroup>
		</form>
	);
};

export default AddVideo;
