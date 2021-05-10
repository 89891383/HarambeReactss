import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			// margin: theme.spacing(1),
			backgroundColor: "#6441a5",
			// borderColor: "white",
			color: "white",
			transition: "0.3s ease-in-out",
			"&:hover": {
				color: "white",
				borderColor: "#6441a5",
			},
		},
	},
}));

export default function OutlinedButtons({ text, onClick, style, children }) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Button
				onClick={onClick && onClick}
				style={style && style}
				variant="outlined"
			>
				{children}
			</Button>
		</div>
	);
}
