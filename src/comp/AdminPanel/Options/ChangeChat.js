import {
	Box,
	Button,
	IconButton,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { DataContext } from "../../../App";
import CloseIcon from "@material-ui/icons/Close";
import { Fade } from "@material-ui/core";

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
});

const ChangeChat = () => {
	const { socket } = useContext(DataContext);

	const [isOpen, setIsOpen] = useState(false);

	const [newChat, setNewChat] = useState("");

	const openChangeAdmin = () => {
		setIsOpen((prev) => !prev);
	};

	const handleChangeChat = (e) => {
		e.preventDefault();
		if (newChat) {
			socket.emit("changeTwitchChat", newChat);
			setNewChat("");
		}
		setIsOpen(false);
	};

	const classes = useStyles();

	return (
		<div className="oneOption">
			<Button
				onClick={openChangeAdmin}
				className={classes.btn}
				variant="outlined"
			>
				Change chat
			</Button>

			{/* INSER NEW ADMIN CONTAINER */}

			<Fade in={isOpen} unmountOnExit timeout={300}>
				<div className="insertChat">
					<Box className={classes.closeButton} onClick={() => setIsOpen(false)}>
						<CloseIcon />
					</Box>

					<Typography variant="h4">Change chat:</Typography>

					<form>
						<TextField
							className={classes.textField}
							value={newChat}
							onChange={(e) => {
								setNewChat(e.target.value);
							}}
							variant="outlined"
							label="Enter new chatroom"
						/>
						<button
							onClick={handleChangeChat}
							style={{ display: "none" }}
						></button>
					</form>

					<Button className={classes.changeButton} onClick={handleChangeChat}>
						Change chat
					</Button>
				</div>
			</Fade>
			{/* END OF ADMIN CONTAINER */}
		</div>
	);
};

export default ChangeChat;
