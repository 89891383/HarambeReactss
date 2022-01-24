import { Box, Fade, makeStyles } from "@material-ui/core";
import React from "react";
import { useRef } from "react";
import { useClickAway } from "react-use";

const useStyles = makeStyles({
	closeBackground: {
		width: "100%",
		height: "100%",
		position: "fixed",
		top: "0",
		left: "0",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		zIndex: "10",
	},
	popoutContainer: {
		height: "fit-content",
		width: "fit-content",
		borderRadius: "10px",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		boxShadow: "0 0 1px 6000px rgba(0, 0, 0, 0.5)",
	},
});

const Popout = ({ children, state, setState }) => {
	const popoutRef = useRef(null);

	const classes = useStyles();

	useClickAway(popoutRef, () => {
		setState(); // CLOSE
	});

	return (
		<Fade unmountOnExit in={state} timeout={300}>
			<Box className={classes.closeBackground}>
				<Box className={classes.popoutContainer} ref={popoutRef}>
					{children}
				</Box>
			</Box>
		</Fade>
	);
};

export default Popout;
