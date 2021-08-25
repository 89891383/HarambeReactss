import HighQualityIcon from "@material-ui/icons/HighQuality";
import { Box, Fade, makeStyles } from "@material-ui/core";
import React, { useRef, useState } from "react";
import "./Quality.css";
import { useClickAway } from "react-use";
// import Delay from './Delay';
import { useSelector } from "react-redux";
import FormatOption from "./FormatOption";
import "../../../../App.css";

const useStyles = makeStyles({
	settingsIcon: {
		height: "100%",
		width: "auto",
		color: "white",
		transition: "300ms color ease",
		margin: "none",
		"&:hover": {
			color: "rgb(63,81,181)",
		},
	},
	button: {
		backgroundColor: "white",
		color: "black",
		width: "15px",
		height: "30px",
		"&:hover": {
			backgroundColor: "white",
			color: "red",
		},
	},
	qualityDialog: {
		transform: "translate(-25%, -100%)",
	},
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		cursor: "pointer",
		transition: "300ms",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3);",
		},
	},
});

const Quality = () => {
	const classes = useStyles();

	let { currentAvailableFormats } = useSelector((state) => state.player);

	const ref = useRef(null);

	useClickAway(ref, () => {
		setIsOpen(false);
	});

	const createFormats = currentAvailableFormats?.map((item) => {
		return <FormatOption item={item} key={item.url} />;
	});

	const [isOpen, setIsOpen] = useState(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<div className="playerSettings" ref={ref}>
			<Box className={classes.box} onClick={() => setIsOpen((prev) => !prev)}>
				<HighQualityIcon />
			</Box>

			<Fade in={isOpen} unmountOnExit timeout={300}>
				<div className="playerSettingsDialog" onClick={handleClose}>
					{createFormats}
				</div>
			</Fade>
		</div>
	);
};

export default Quality;
