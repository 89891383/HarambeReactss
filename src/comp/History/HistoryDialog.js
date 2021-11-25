import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import React from "react";
import HistoryItem from "./HistoryItem";
import {
	Box,
	CircularProgress,
	makeStyles,
	Tooltip,
	Typography,
	Zoom,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
	box: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		position: "relative",
	},
	deleteIcon: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		height: "fit-content",
		cursor: "pointer",
		color: "white",
		marginLeft: "auto",
		position: "absolute",
		right: "0%",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3)",
		},
	},
});

const HistoryDialog = () => {
	const classes = useStyles();

	const { admin } = useSelector((state) => state.player);

	const { socket } = useContext(DataContext);

	const [history, setHistory] = useState([]);
	useEffect(() => {
		socket.emit("getPlaylistHistory");
		socket.on("getPlaylistHistoryAnswer", ({ history }) => {
			if (history) {
				setHistory(history.reverse());
			}
		});

		return () => {
			socket.off("getPlaylistHistoryAnswer");
		};
	}, [socket]);

	const createHistory = history?.map((video, index) => {
		const { URL, title } = video;
		return (
			<HistoryItem key={index} URL={URL}>
				<a href={URL} target="_blank" rel="noopener noreferrer">
					{title ? title : URL}
				</a>
			</HistoryItem>
		);
	});

	const handleClearHistory = () => {
		if (!admin) return false;
		socket.emit("clearHistory");
	};

	const checkIsEmpty = createHistory?.length ? (
		createHistory
	) : (
		<span className="emptyHistoryText">HISTORY IS EMPTY</span>
	);

	return (
		<div className="historyContainer">
			<Box className={classes.box}>
				<Typography variant="h4">Last played:</Typography>
				{admin && (
					<Box className={classes.deleteIcon} onClick={handleClearHistory}>
						<Tooltip
							title={"Clear history"}
							enterDelay={0}
							TransitionComponent={Zoom}
						>
							<DeleteIcon />
						</Tooltip>
					</Box>
				)}
			</Box>

			{/* <h2></h2> */}
			{createHistory ? checkIsEmpty : <CircularProgress />}
		</div>
	);
};

export default HistoryDialog;
