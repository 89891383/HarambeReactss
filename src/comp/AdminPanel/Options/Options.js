import React from "react";
import "./Options.css";
import SettingsIcon from "@material-ui/icons/Settings";
import { Box, makeStyles, Tooltip, Zoom } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { dialogOpenToggle } from "../../../redux/playerState";

const useStyles = makeStyles({
	box:{
        padding:'5px',
        borderRadius:'5px',
        display:'flex',
        transition:'300ms',
        cursor:'pointer',
        '&:hover':{
            backgroundColor:'rgba(255, 255, 255, 0.3)'
        }
    },
});

const Options = () => {

	const dispatch = useDispatch()


	const handleToggleDialog = () => {
		dispatch(dialogOpenToggle(true))
	};

	const classes = useStyles();

	return (
		<div className="options">
			<Box
				className={classes.box}
				onClick={handleToggleDialog}
			>
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
