import { Box, makeStyles } from "@material-ui/core";
import VideocamIcon from "@material-ui/icons/Videocam";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { DataContext } from "../../../App";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";

const useStyles = makeStyles({
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3)",
		},
	},
});

const TwitchCamToggle = () => {
	const classes = useStyles();

	const { socket } = useContext(DataContext);

	const { isTwitchCam } = useSelector((state) => state.player);

	const twitchCamToggle = () => {
		socket.emit("isTwitchCamToggle");
	};

	return (
		<Box className={classes.box} onClick={twitchCamToggle}>
			{isTwitchCam ? <VideocamOffIcon /> : <VideocamIcon />}
		</Box>
	);
};

export default TwitchCamToggle;
