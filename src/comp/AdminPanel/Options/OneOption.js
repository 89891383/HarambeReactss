import React from "react";
import { Box, makeStyles, Switch, Typography } from "@material-ui/core";

const useStyles = makeStyles({
	oneOption: {
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
		padding: "20px",
		backgroundColor: "#0f0f0f",
		borderRadius: "5px",
	},
});

const OneOption = ({ children, checked, onChange }) => {
	const classes = useStyles();

	return (
		<Box className={classes.oneOption}>
			{children}

			<Typography>
				OFF <Switch checked={checked} onChange={onChange} /> ON
			</Typography>
		</Box>
	);
};

export default OneOption;
