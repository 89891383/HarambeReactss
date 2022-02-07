import { useContext, useMemo } from "react";
import { DataContext } from "../../App";
import React from "react";
import HistoryItem from "./HistoryItem";
import { Box, makeStyles, Tooltip, Typography, Zoom } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSelector } from "react-redux";
import { sharedStyles } from "../../shared/styles";

const useStyles = makeStyles({
	box: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		position: "relative",
	},
	deleteIcon: {
		...sharedStyles.box,
		position: "absolute",
		left: "0",
	},
	historyContainer: {
		width: "98vw",
		margin: "0 auto",
		maxWidth: "500px",
		height: "90vh",
		maxHeight: "400px",
		backgroundColor: "#121212",
		display: "flex",
		flexDirection: "column",
		padding: "30px 20px",
		alignItems: "center",
		gap: "10px",
		overflow: "scroll",
		borderRadius: "5px",
		position: "relative",
	},
	emptyHistoryTypo: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%,-50%)",
		backgroundColor: "#0f0f0f",
		padding: "15px",
		width: "80%",
		borderRadius: "10px",
		color: "#242424",
		fontWeight: "700",
	},
});

const HistoryDialog = () => {
	const classes = useStyles();

	const { admin, history } = useSelector((state) => state.player);

	const { socket } = useContext(DataContext);

	const createHistory = useMemo(() => {
		return history?.map((video, index) => {
			const { URL, title } = video;
			return (
				<HistoryItem key={index} URL={URL}>
					<a href={URL} target="_blank" rel="noopener noreferrer">
						<Typography noWrap>{title ? title : URL}</Typography>
					</a>
				</HistoryItem>
			);
		});
	}, [history]);

	if (!history.length) {
		return (
			<Box className={classes.historyContainer}>
				<Typography variant="h3" className={classes.emptyHistoryTypo}>
					HISTORY IS EMPTY
				</Typography>
			</Box>
		);
	}

	const handleClearHistory = () => {
		if (!admin) return false;
		socket.emit("clearHistory");
	};

	return (
		<Box className={classes.historyContainer}>
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
			{createHistory}
		</Box>
	);
};

export default HistoryDialog;
