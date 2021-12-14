import { Box, Button, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { DataContext } from "../../App";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import { pollOpenToggle } from "../../redux/popoutsSlice";

const useStyles = makeStyles({
	btn: {
		backgroundColor: "#6441a5",
		color: "white",
		"&:hover": {
			borderColor: "#6441a5",
		},
	},
	closeButton: {
		position: "absolute",
		top: "5%",
		right: "5%",
		color: "white",
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		height: "fit-content",
		cursor: "pointer",
		marginLeft: "auto",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3)",
		},
	},
	changeButton: {
		color: "white",
		backgroundColor: "#6441a5",
		border: "1px solid transparent",
		padding: "5px 20px",
		"&:hover": {
			border: "1px solid #6441a5",
		},
	},
	textField: {
		width: "100%",
		maxWidth: "300px",
	},
	input: {
		color: "white",
	},
	inputLabel: {
		color: "white",
	},
	box: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: " translate(-50%, -50%)",
		backgroundColor: "#121212",
		width: "98%",
		maxWidth: "500px",
		height: "400px",
		zIndex: "2",
		borderRadius: "5px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		gap: "20px",
	},
	btnBox: {
		display: "flex",
		gap: "15px",
		width: "300px",
		justifyContent: "center",
	},
});

const SetPoll = () => {
	const { socket } = useContext(DataContext);

	const { nickname, admin } = useSelector((state) => state.player);
	const dispatch = useDispatch();

	const classes = useStyles();

	const defaultValues = {
		defaultValues: {
			pollMessage: " ",
		},
	};

	const { control, handleSubmit, reset } = useForm({ defaultValues });

	if (!admin) return false;

	const handleSetPoll = (data) => {
		const { pollMessage } = data;
		if (pollMessage) {
			socket.emit("createPoll", { message: pollMessage, nickname });
		}
		reset(defaultValues);
		dispatch(pollOpenToggle(false));
	};

	const handleClosePoll = () => {
		socket.emit("clearPoll", nickname);
	};

	return (
		<Box className={classes.box}>
			<Box
				className={classes.closeButton}
				onClick={() => dispatch(pollOpenToggle(false))}
			>
				<CloseIcon />
			</Box>

			<Typography variant="h4">Set poll message</Typography>
			<form style={{ width: "100%" }}>
				<Controller
					name="pollMessage"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className={classes.textField}
							autoComplete="off"
							variant="outlined"
							label="Poll message"
						/>
					)}
				/>
				<button
					onClick={handleSubmit(handleSetPoll)}
					style={{ display: "none" }}
				></button>
			</form>
			<Box className={classes.btnBox}>
				<Button
					className={classes.changeButton}
					onClick={handleSubmit(handleSetPoll)}
				>
					Set poll
				</Button>
				<Button className={classes.changeButton} onClick={handleClosePoll}>
					Close poll
				</Button>
			</Box>
		</Box>
	);
};

export default SetPoll;
