import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
// import React, { useState, useEffect } from "react";
import colors from "../../colors";

const useStyles = makeStyles({
	box: {
		width: "100%",
		height: "4px",
		position: "absolute",
		bottom: "0",
		overflow: "hidden",
	},
	progress: {
		width: "100%",
		height: "100%",
		backgroundColor: "white",
		transform: "translateX(0)",
		transition: "1000ms linear transform, 300ms ease background",
	},
});

const chooseColor = (value) => {
	if (value > 50) {
		return colors.green;
	} else if (value <= 50 && value > 25) {
		return colors.orange;
	} else {
		return colors.red;
	}
};

const Timer = ({ value = 100 }) => {
	const classes = useStyles();

	const progressStyles = {
		transform: `translateX(-${100 - value}%)`,
		backgroundColor: chooseColor(value),
	};

	return (
		<Box className={classes.box}>
			<Box style={progressStyles} className={classes.progress}></Box>
		</Box>
	);
};

export default Timer;
