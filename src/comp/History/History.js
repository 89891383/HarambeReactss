import React from "react";
import "./History.css";
import HistoryIcon from "@material-ui/icons/History";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { historyOpenToggle } from "../../redux/playerState";

const useStyles = makeStyles({
	historyBtn: {
		color: "white",
	},
});

const History = () => {
	const classes = useStyles();

	const dispatch = useDispatch()

	const handleToggleHistory = () => {
		dispatch(historyOpenToggle(true))
	};

	return (
		<IconButton className={classes.historyBtn} onClick={handleToggleHistory}>
			<Tooltip title={"History"} enterDelay={0}>
				<HistoryIcon />
			</Tooltip>
		</IconButton>
	);
};

export default History;
