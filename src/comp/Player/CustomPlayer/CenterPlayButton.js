import { Box, makeStyles } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { useContext } from "react";
import { DataContext } from "../../../App";
import { sharedStyles } from "../../../shared/styles";
import "./CustomPlayer.css";

const useStyles = makeStyles({
	playButton: {
		fontSize: "150px",
	},
	box: {
		...sharedStyles.box,
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		fontWeight: "700",
		zIndex: 2,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
	},
});

const CenterPlayButton = () => {
	const classes = useStyles();

	const { socket } = useContext(DataContext);

	const handlePlay = () => {
		socket.emit("canPlay");
	};

	return (
		<Box className={classes.box} onClick={handlePlay}>
			<PlayArrowIcon className={classes.playButton} />
		</Box>
	);
};

export default CenterPlayButton;
