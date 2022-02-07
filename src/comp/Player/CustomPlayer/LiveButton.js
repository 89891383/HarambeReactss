import { Box, makeStyles } from "@material-ui/core";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { DataContext } from "../../../App";
import { sharedStyles } from "../../../shared/styles";

const useStyles = makeStyles({
	box: {
		...sharedStyles.box,
		fontWeight: "700",
		transition: "300ms ease",
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
