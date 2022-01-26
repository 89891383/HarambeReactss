import { Box, makeStyles } from "@material-ui/core";
import Draggable from "react-draggable";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import { useSelector } from "react-redux";
import { useState } from "react";

const useStyles = makeStyles({
	box: {
		position: "absolute",
		width: "330px",
		aspectRatio: "16/9",
		borderRadius: "5px",
		overflow: "hidden",
		"@media (max-width:600px)": {
			display: "none",
		},
		"@media (max-width:1000px)": {
			width: "230px",
		},
	},
	iframe: {
		width: "100%",
		height: "100%",
	},
	drag: {
		padding: "5px",
		position: "absolute",
		color: "white",
		top: "0",
		left: "100%",
		transform: "translateX(-100%)",
		backgroundColor: "#121212",
		borderRadius: "0 0 0 5px",
		display: "flex",
		transition: "300ms opacity",
		cursor: "grab",
		"&:hover": {
			opacity: "1 !important",
		},
	},
});

const TwitchCam = () => {
	const classes = useStyles();

	const { currentChat } = useSelector((state) => state.player);
	const currentPage = window.location.hostname;

	const [isDragIcon, setIsDragIcon] = useState(false);

	const handleStart = () => {
		const root = document.querySelector("#root");
		root.style.pointerEvents = "none";
	};

	const handleStop = () => {
		const root = document.querySelector("#root");
		root.style.pointerEvents = "";
	};
	// SET POINTER EVENTS TO NONE

	return (
		<Draggable
			bounds={"parent"}
			onStart={handleStart}
			onStop={handleStop}
			handle={"#drag"}
		>
			<Box
				className={classes.box}
				onMouseEnter={() => setIsDragIcon(true)}
				onMouseLeave={() => setIsDragIcon(false)}
			>
				<iframe
					src={`https://player.twitch.tv/?channel=${currentChat}&parent=${currentPage}`}
					frameBorder="0"
					scrolling="no"
					allowFullScreen
					title="twitch cam"
					className={classes.iframe}
				></iframe>
				<Box
					id="drag"
					style={isDragIcon ? { opacity: 0.2 } : { opacity: 0 }}
					className={classes.drag}
				>
					<ControlCameraIcon />
				</Box>
			</Box>
		</Draggable>
	);
};

export default TwitchCam;
