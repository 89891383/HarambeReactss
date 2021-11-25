import React from "react";
import "./History.css";
import HistoryIcon from "@material-ui/icons/History";
import { Box, makeStyles, Tooltip, Zoom } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { historyOpenToggle } from "../../redux/popoutsSlice";

const useStyles = makeStyles({
	historyBtn: {
		color: "white",
	},
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		height: "fit-content",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3)",
		},
	},
});

const History = () => {
	const classes = useStyles();

	const dispatch = useDispatch();

	const handleToggleHistory = () => {
		dispatch(historyOpenToggle(true));
	};

	return (
		<Box className={classes.box} onClick={handleToggleHistory}>
			<Tooltip title={"History"} enterDelay={0} TransitionComponent={Zoom}>
				<HistoryIcon />
			</Tooltip>
		</Box>
	);
};

export default History;
