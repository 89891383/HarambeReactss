import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { changeIsError } from "../../redux/playerState";

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

	const {isError, errorMessage} = useSelector(state=> state.player)

	const dispatch = useDispatch()

	// const { isError, setIsError, errorMessage } = useContext(DataContext);
	const classes = useStyles();

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		dispatch(changeIsError(false))
	};

	return (
		<div className={classes.root}>
			<Snackbar open={isError} autoHideDuration={2000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error">
					{errorMessage}
				</Alert>
			</Snackbar>

			{/* <Alert severity="success">This is a success message!</Alert> */}
		</div>
	);
}
