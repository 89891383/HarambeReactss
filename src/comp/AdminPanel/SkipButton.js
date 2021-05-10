import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
			borderColor: "white",
			color: "white",
			transition: "0.3s",
			"&:hover": {
				borderColor: "#f94144",
				color: "#f94144",
			},
		},
	},
}));

export default function OutlinedButtons({ onClick, style, children, title }) {
	const classes = useStyles();

	return (
		<Tooltip title={title} enterDelay={1000} arrow>
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
