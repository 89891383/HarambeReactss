import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { Box, Slide } from "@material-ui/core";
import { closeAlert } from "../../redux/alertSlice";

function Alert(props) {
	return <MuiAlert elevation={6} variant="standard" {...props} />;
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
	const { isAlert, type, message } = useSelector((state) => state.alert);

	const dispatch = useDispatch();

	const classes = useStyles();

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		dispatch(closeAlert());
	};

	return (
		<Box className={classes.root}>
			<Snackbar
				open={isAlert}
				autoHideDuration={2000}
				anchorOrigin={{ horizontal: "left", vertical: "top" }}
				onClose={handleClose}
				TransitionComponent={Slide}
			>
				<Box>
					<Alert onClose={handleClose} severity={type}>
						{message.toUpperCase()}
					</Alert>
				</Box>
			</Snackbar>
		</Box>
	);
}
