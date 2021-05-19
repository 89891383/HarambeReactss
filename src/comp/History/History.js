import React from "react";
import "./History.css";
import HistoryIcon from "@material-ui/icons/History";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { useContext } from "react";
import { DataContext } from "../../App";

const useStyles = makeStyles({
	historyBtn: {
		color: "white",
	},
});

const History = () => {
	const classes = useStyles();

	const { setIsHistoryOpen } = useContext(DataContext);

	const handleToggleHistory = () => {
		setIsHistoryOpen((prev) => !prev);
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
