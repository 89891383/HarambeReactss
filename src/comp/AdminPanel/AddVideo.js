import React, { useCallback } from "react";
import { useContext } from "react";
import { DataContext } from "../../App";
import "./AdminPanel.css";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import QueueIcon from "@material-ui/icons/Queue";
import { useForm, Controller } from "react-hook-form";
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
import { setAlert } from "../../redux/alertSlice";

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
	inputBox: {
		display: "flex",
		flexDirection: "column",
		gap: "10px",
		justifyContent: "center",
		flexWrap: "wrap",
	},
	addVideoForm: {
		width: "98vw",
		maxWidth: "500px",
		padding: "30px",
		backgroundColor: "#121212",
		borderRadius: "10px",
		display: "flex",
		flexDirection: "column",
		gap: "5px",
	},
});

const linkRegExpCheck = (link) => {
	return link.match(
		/(https?:\/\/)?(www\.)?[a-zA-Z]+\.[a-zA-Z]+\/?[a-zA-Z0-9?=-]*/
	);
};

const AddVideo = () => {
	const classes = useStyles();

	const { admin, nickname } = useSelector((state) => state.player);

	const dispatch = useDispatch();

	const { control, handleSubmit, watch } = useForm({
		defaultValues: {
			videoLink: "",
			videoTitle: "",
			isImdb: false,
			imdbID: "",
		},
	});

	const { socket } = useContext(DataContext);

	const handleSkipVideo = () => {
		if (admin) {
			socket.emit("skipVideo", { nickname });
		}
	};

	const handleAddVideo = useCallback(
		(data) => {
			const { videoLink } = data;

			const regExpCheck = linkRegExpCheck(videoLink);

			if (data.videoLink && Boolean(regExpCheck)) {
				const { videoLink, videoTitle } = data;
				socket.emit("videoChange", {
					videoLink,
					videoTitle,
				});
				dispatch(changeIsAddVideo(false));
			} else {
				dispatch(
					setAlert({ message: "YOUR LINK IS NOT CORRECT!", type: "error" })
				);
			}
		},
		[dispatch, socket]
	);

	const handleAddVideoToQueue = useCallback(
		(data) => {
			const { isImdb, imdbID, videoLink } = data;

			const regExpCheck = linkRegExpCheck(videoLink);

			if (isImdb) {
				const imdbRegExp = imdbID.match(/tt[0-9]+/);
				if (!Boolean(imdbRegExp)) {
					return dispatch(
						setAlert({ message: "ImdbID IS WRONG!", type: "error" })
					);
				}
			}

			if (data.videoLink && Boolean(regExpCheck)) {
				socket.emit("queueUpdate", { ...data, nickname });
				dispatch(changeIsAddVideo(false));
			} else {
				dispatch(
					setAlert({ message: "YOUR LINK IS NOT CORRECT!", type: "error" })
				);
			}
		},
		[dispatch, nickname, socket]
	);

	return (
		<form
			className={classes.addVideoForm}
			onSubmit={handleSubmit(handleAddVideoToQueue)}
		>
			<Typography variant="h4" gutterBottom>
				Add your video to queue
			</Typography>
			<hr />
			<Box className={classes.inputBox}>
				<Controller
					name="videoLink"
					control={control}
					render={({ field }) => (
						<TextField
							label="Enter video URL"
							autoComplete="off"
							color="primary"
							variant="outlined"
							className={classes.textField}
							{...field}
						/>
					)}
				/>
				<Controller
					name="videoTitle"
					control={control}
					render={({ field }) => (
						<TextField
							label="Title"
							autoComplete="off"
							color="primary"
							variant="outlined"
							className={classes.textField}
							{...field}
						/>
					)}
				/>
				{admin && (
					<Box className={classes.imdbBox}>
						<Controller
							name="isImdb"
							control={control}
							render={({ field }) => (
								<FormControlLabel
									{...field}
									control={<Checkbox color="primary" />}
									label="IMDB"
								/>
							)}
						/>
						<Fade in={watch("isImdb")} unmountOnExit timeout={300}>
							<Box style={{ marginLeft: "auto" }}>
								<Controller
									name="imdbID"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											className={classes.imdbTextField}
											variant="outlined"
											label="Imdb move ID"
											placeholder="tt0068646"
										/>
									)}
								/>
							</Box>
						</Fade>
					</Box>
				)}
			</Box>

			<button style={{ display: "none" }} type="submit"></button>

			<ButtonGroup variant="outlined" className={classes.groupButton}>
				{admin && (
					<Button
						onClick={handleSubmit(handleAddVideo)}
						startIcon={<PlayArrowIcon />}
						className={classes.button}
					>
						PLAY NOW
					</Button>
				)}

				<Button
					startIcon={<QueueIcon />}
					onClick={handleSubmit(handleAddVideoToQueue)}
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
