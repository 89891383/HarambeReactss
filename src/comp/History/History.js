import React from "react";
import "./History.css";
import HistoryIcon from "@material-ui/icons/History";
import { Box, Tooltip, Zoom } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { historyOpenToggle } from "../../redux/popoutsSlice";
import { sharedStyles } from "../../shared/styles";

const History = () => {
	const dispatch = useDispatch();

	const handleToggleHistory = () => {
		dispatch(historyOpenToggle(true));
	};

	return (
		<Box sx={sharedStyles.box} onClick={handleToggleHistory}>
			<Tooltip title={"History"} enterDelay={0} TransitionComponent={Zoom}>
				<HistoryIcon />
			</Tooltip>
		</Box>
	);
};

export default History;
