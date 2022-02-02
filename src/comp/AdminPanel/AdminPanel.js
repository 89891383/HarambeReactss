import React from "react";
import Button2 from "../Button";
import { Box, Button, Typography } from "@material-ui/core";
import "./AdminPanel.css";
import Queue from "../Queue/Queue";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import SideOptions from "../SideOptions";
import { changeIsAddVideo } from "../../redux/popoutsSlice";
import colors from "../../colors";

const useStyles = makeStyles({
	bottomBox: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		gap: "10px",
	},
	addVideoBtn: {
		color: colors.green,
		fontWeight: "700",
		borderColor: colors.green,
		"&:hover": {
			borderColor: colors.green,
		},
		"&:disabled": {
			color: colors.red,
			borderColor: colors.red,
		},
		"@media (max-width:460px)": {
			marginRight: "17px",
		},
	},
	queueCounter: {
		padding: "6px 12px",
		fontWeight: "700",
		backgroundColor: colors.backgroundGrey,
		borderRadius: "5px",
		border: `1px solid ${colors.borderGrey}`,
	},
	queueCounter_Wrapper: {
		width: "fit-content",
		marginRight: "auto",
		display: "flex",
		gap: "10px",
	},
	adminPanel: {
		color: "white",
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "flex-end",
		marginTop: "50px",
		width: "95%",
	},
});

const AdminPanel = () => {
	const classes = useStyles();

	const dispatch = useDispatch();

	const { admin, nickname, isPlaylistOpen, videoQueue } = useSelector(
		(state) => state.player
	);

	const handleTwitchLogin = () => {
		window.location.href = `/auth/twitch`; //DECLARED IN APP
	};

	const isDisabled = admin ? false : !isPlaylistOpen;

	const handleOpenAddVideo = () => {
		if (!isDisabled) {
			dispatch(changeIsAddVideo(true));
		}
	};

	return (
		<Box className={classes.bottomBox}>
			{/* ADDING VIDEO PANEL */}
			<Box className={classes.adminPanel}>
				<Box className={classes.queueCounter_Wrapper}>
					<Box className={classes.queueCounter}>{videoQueue.length}</Box>
					<Typography variant="h6">Current queue:</Typography>
				</Box>
				{/* QUEUE_H3 CSS IS IN Queue.css */}

				<SideOptions />

				{nickname && (
					<Button
						variant="outlined"
						className={classes.addVideoBtn}
						onClick={handleOpenAddVideo}
					>
						ADD VIDEO
					</Button>
				)}

				{!nickname && (
					<Button2 onClick={handleTwitchLogin}> LOGIN WITH TWITCH</Button2>
				)}
			</Box>
			<Queue />
		</Box>
	);
};

export default AdminPanel;
