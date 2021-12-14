import {
	Box,
	Button,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { DataContext } from "../../../App";
import CloseIcon from "@material-ui/icons/Close";
import { Fade } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";

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
		color: "white",
		margin: "10px 0",
		"& .MuiOutlinedInput-root": {
			"& fieldset": {
				borderColor: "white",
			},
			"&:hover fieldset": {
				borderColor: "#757ce8",
			},
			"&.Mui-focused fieldset": {
				borderColor: "#3f50b5",
			},
		},
	},
	input: {
		color: "white",
	},
	inputLabel: {
		color: "white",
	},
	insertChat: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: " translate(-50%, -50%)",
		backgroundColor: "#121212",
		width: "100%",
		height: " 100%",
		zIndex: "2",
		borderRadius: "5px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		gap: "20px",
	},
	oneOption: {
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
		padding: "20px",
		backgroundColor: "#0f0f0f",
		borderRadius: "5px",
	},
});

const ChangeChat = () => {
	const { socket } = useContext(DataContext);

	const defaultValues = {
		defaultValues: {
			newChat: "",
		},
	};

	const { control, handleSubmit, reset } = useForm({ defaultValues });

	const [isOpen, setIsOpen] = useState(false);

	const openChangeAdmin = () => {
		setIsOpen((prev) => !prev);
	};

	const handleChangeChat = (data) => {
		const { newChat } = data;
		if (newChat) {
			socket.emit("changeTwitchChat", newChat);
		}
		setIsOpen(false);
		reset(defaultValues);
	};

	const classes = useStyles();

	return (
		<Box className={classes.oneOption}>
			<Button
				onClick={openChangeAdmin}
				className={classes.btn}
				variant="outlined"
			>
				Change chat
			</Button>

			<Fade in={isOpen} unmountOnExit timeout={300}>
				<Box className={classes.insertChat}>
					<Box className={classes.closeButton} onClick={() => setIsOpen(false)}>
						<CloseIcon />
					</Box>

					<Typography variant="h4">Change chat</Typography>
					<form>
						<Controller
							name="newChat"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									autoComplete="off"
									variant="outlined"
									label="Enter new chatroom"
								/>
							)}
						/>
						<button
							onClick={handleSubmit(handleChangeChat)}
							style={{ display: "none" }}
						></button>
					</form>

					<Button
						className={classes.changeButton}
						onClick={handleSubmit(handleChangeChat)}
					>
						Change chat
					</Button>
				</Box>
			</Fade>
		</Box>
	);
};

export default ChangeChat;
