import React from "react";
import "./Options.css";
import SettingsIcon from "@material-ui/icons/Settings";
import { Box, Tooltip, Zoom } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { dialogOpenToggle } from "../../../redux/popoutsSlice";
import { sharedStyles } from "../../../shared/styles";

const Options = () => {
	const dispatch = useDispatch();

	const handleToggleDialog = () => {
		dispatch(dialogOpenToggle(true));
	};

	return (
		<div className="options">
			<Box sx={sharedStyles.box} onClick={handleToggleDialog}>
				<Tooltip
					title="Settings"
					placement="bottom"
					enterDelay={0}
					TransitionComponent={Zoom}
				>
					<SettingsIcon />
				</Tooltip>
			</Box>
		</div>
	);
};

export default Options;
