import React from "react";
import "./Options.css";
import SettingsIcon from "@material-ui/icons/Settings";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { DataContext } from "../../../App";
import { useContext } from "react";

const useStyles = makeStyles({
	settingsButton: {
		color: "white",
	},
});

const Options = () => {
	const { setIsDialogOpen } = useContext(DataContext);

	const handleToggleDialog = () => {
		setIsDialogOpen((prev) => !prev);
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
