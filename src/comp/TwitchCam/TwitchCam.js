import { Box, makeStyles } from "@material-ui/core";
import { useRef } from "react";
import { useSelector } from "react-redux";
import useMobile from "../../Hooks/useMobile";
import ResizeableAndDraggable from "../ResizeableAndDraggable";
import Draggable from "react-draggable";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";

const useStyles = makeStyles({
	box: {
		position: "relative",
		width: "100%",
		height: "100%",
		borderRadius: "5px",
		overflow: "hidden",
	},
	mobileBox: {
		position: "fixed",
		maxWidth: "220px",
		width: "30%",
		top: 0,
		left: 0,
		zIndex: 1,
		aspectRatio: "16/9",
		borderRadius: "5px",
		overflow: "hidden",
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
		opacity: 0.4,
		"&:hover": {
			opacity: "1 !important",
		},
	},
});

const TwitchCam = () => {
	const classes = useStyles();

	const { currentChat } = useSelector((state) => state.player);
	const currentPage = window.location.hostname;
	const twitchCamRef = useRef(null);

	const handleStart = () => {
		const root = document.querySelector("#root");
		root.style.pointerEvents = "none";
	};

	const handleStop = () => {
		const root = document.querySelector("#root");
		root.style.pointerEvents = "";
	};

	const iFrame = (
		<iframe
			src={`https://player.twitch.tv/?channel=${currentChat}&parent=${currentPage}`}
			frameBorder="0"
			scrolling="no"
			allowFullScreen
			title="twitch cam"
			className={classes.iframe}
		></iframe>
	);

	return (
		<>
			{useMobile(1000) ? (
				<Draggable
					bounds={"parent"}
					onStart={handleStart}
					onStop={handleStop}
					handle={"#drag"}
				>
					<Box className={classes.mobileBox}>
						{iFrame}
						<Box id="drag" className={classes.drag}>
							<ControlCameraIcon />
						</Box>
					</Box>
				</Draggable>
			) : (
				<ResizeableAndDraggable>
					<Box id="twitchCam" ref={twitchCamRef} className={classes.box}>
						{iFrame}
					</Box>
				</ResizeableAndDraggable>
			)}
		</>
	);
};

export default TwitchCam;
