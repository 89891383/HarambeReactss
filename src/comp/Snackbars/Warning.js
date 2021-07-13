import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { changeIsWarning } from "../../redux/playerState";

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

	const { isWarning, warningMessage } = useSelector(state=> state.player);
	const classes = useStyles();

	const dispatch = useDispatch()

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		dispatch(changeIsWarning(false))
	};

	return (
		<div className={classes.root}>
			<Snackbar open={isWarning} autoHideDuration={2000} 
		 	anchorOrigin={{horizontal:'left', vertical:'top'}} onClose={handleClose}>
				<Alert onClose={handleClose} severity="warning">
					{warningMessage}
				</Alert>
			</Snackbar>
		</div>
	);
}
