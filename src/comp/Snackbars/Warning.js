import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { DataContext } from "../../App";
import { useContext } from "react";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		"& > * + *": {
			marginTop: theme.spacing(2),
		},
	},
}));

export default function CustomizedSnackbars() {
	const { isWarning, setIsWarning, warningMessage } = useContext(DataContext);
	const classes = useStyles();

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setIsWarning(false);
	};

	return (
		<div className={classes.root}>
			<Snackbar open={isWarning} autoHideDuration={2000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="warning">
					{warningMessage}
				</Alert>
			</Snackbar>
		</div>
	);
}
