import React from "react";
import "./Options.css";
import SettingsIcon from "@material-ui/icons/Settings";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { dialogOpenToggle } from "../../../redux/playerState";

const useStyles = makeStyles({
	settingsButton: {
		color: "white",
	},
});

const Options = () => {

	const dispatch = useDispatch()


	const handleToggleDialog = () => {
		dispatch(dialogOpenToggle())
	};

	const classes = useStyles();

	return (
		<div className="options">
			<IconButton
				className={classes.settingsButton}
				onClick={handleToggleDialog}
			>
				<Tooltip
					title="Settings"
					placement="bottom"
					className={classes.toolTip}
					enterDelay={0}
				>
					<SettingsIcon />
				</Tooltip>
			</IconButton>
		</div>
	);
};

export default Options;
