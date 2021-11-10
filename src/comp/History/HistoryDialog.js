import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import React from "react";
import Popout from "../Popout";
import HistoryItem from "./HistoryItem";
import {
	CircularProgress,
	IconButton,
	makeStyles,
	Tooltip,
	Zoom,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDispatch, useSelector } from "react-redux";
import { historyOpenToggle } from "../../redux/playerState";

const useStyles = makeStyles({
	clearHistory: {
		color: "white",
		position: "absolute",
		right: "2%",
		top: "2%",
	},
});

const HistoryDialog = () => {
	const classes = useStyles();

	const dispatch = useDispatch();

	const { admin, isHistoryOpen } = useSelector((state) => state.player);

	const { socket } = useContext(DataContext);

	const [history, setHistory] = useState(null);
	useEffect(() => {
		if (isHistoryOpen) {
			socket.emit("getPlaylistHistory");
		}
		socket.on("getPlaylistHistoryAnswer", ({ history }) => {
			if (history) {
				setHistory(history.reverse());
			}
		});

		return () => {
			socket.off("getPlaylistHistoryAnswer");
		};
	}, [socket, isHistoryOpen]);

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
		<Popout
			state={isHistoryOpen}
			setState={() => dispatch(historyOpenToggle(false))}
		>
			<div className="historyContainer">
				{admin && (
					<IconButton
						className={classes.clearHistory}
						onClick={handleClearHistory}
					>
						<Tooltip
							title={"Clear history"}
							enterDelay={0}
							TransitionComponent={Zoom}
						>
							<DeleteIcon />
						</Tooltip>
					</IconButton>
				)}

				<h2>Last played:</h2>
				{createHistory ? checkIsEmpty : <CircularProgress />}
			</div>
		</Popout>
	);
};

export default HistoryDialog;
