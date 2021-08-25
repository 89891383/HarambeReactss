import { Box, makeStyles } from "@material-ui/core";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { DataContext } from "../../../App";

const useStyles = makeStyles({
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		fontWeight: "700",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3);",
			color: "#f94144",
		},
		"@media (max-width:600px)": {
			display: "none",
		},
	},
});

const LiveButton = () => {
	const { admin } = useSelector((state) => state.player);

	const { socket } = useContext(DataContext);

	const classes = useStyles();

	const handleLive = () => {
		if (admin) {
			socket.emit("liveVideo");
		}
	};

	return (
		<Box className={classes.box} onClick={handleLive}>
			LIVE
		</Box>
	);
};

export default LiveButton;
