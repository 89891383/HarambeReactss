import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Tooltip, Zoom } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
			borderColor: "white",
			color: "white",
			transition: "0.3s",
			"&:hover": {
				borderColor: "#90be6d",
				color: "#90be6d",
			},
		},
	},
}));

export default function OutlinedButtons({ onClick, style, children, title }) {
	const classes = useStyles();

	return (
		<Tooltip title={title} arrow enterDelay={1000} TransitionComponent={Zoom}>
			<div className={classes.root}>
				<Button
					onClick={onClick && onClick}
					style={style && style}
					variant="outlined"
				>
					{children}
				</Button>
			</div>
		</Tooltip>
	);
}
