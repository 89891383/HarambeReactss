import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			backgroundColor: "#6441a5",
			color: "white",
			transition: "0.3s ease-in-out",
			"&:hover": {
				color: "white",
				borderColor: "#6441a5",
			},
		},
	},
	disabledBtn: {
		backgroundColor: "#121212",
		color: "grey",
		borderRadius: "5px",
		transition: "0.3s ease-in-out",
		"&:hover": {
			color: "white",
			borderColor: "#6441a5",
		},
	},
}));

export default function OutlinedButtons({
	onClick,
	style,
	children,
	disabled,
}) {
	const classes = useStyles();

	return (
		<div className={!disabled ? classes.root : classes.disabledBtn}>
			<Button
				disabled={disabled}
				onClick={onClick && onClick}
				style={style && style}
				variant="outlined"
			>
				{children}
			</Button>
		</div>
	);
}
