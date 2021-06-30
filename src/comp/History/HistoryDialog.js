import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import React from "react";
import Popout from "../Popout";
import HistoryItem from "./HistoryItem";
import { CircularProgress, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
	clearHistory:{
		color:'white',
		position:'absolute',
		right:'2%',
		top:'2%',
	}
})

const HistoryDialog = () => {

	const classes = useStyles()

	const { isHistoryOpen, setIsHistoryOpen, socket,admin } = useContext(DataContext);
	const [history, setHistory] = useState(null);
	useEffect(() => {
		if (isHistoryOpen) {
			socket.emit("getPlaylistHistory");
			socket.on("getPlaylistHistoryAnswer", ({ history }) => {
				if (history) {
					setHistory(history.reverse());
				}
			});
		}
		return () => {
			socket.off("getPlaylistHistoryAnswer");
		};
	}, [socket, isHistoryOpen]);

	const createHistory = history?.map((video, index) => {
		const { URL, title } = video;
		return (
			<HistoryItem key={index} URL={URL} index={index}>
				<a href={URL} target="_blank" rel="noopener noreferrer">
					{title ? title : URL}
				</a>
			</HistoryItem>
		);
	});

	const handleClearHistory = () =>{
		if(!admin) return false
		socket.emit('clearHistory')
	}

	const checkIsEmpty = createHistory?.length ? (
		createHistory
	) : (
		<span className="emptyHistoryText">HISTORY IS EMPTY</span>
	);

	return (
		<Popout state={isHistoryOpen} setState={setIsHistoryOpen}>
			<div className="historyContainer">

				{admin && 
					<IconButton 
						className={classes.clearHistory} 
						onClick={handleClearHistory} >
							<Tooltip title={'Clear history'} enterDelay={0}>
								<DeleteIcon/>
							</Tooltip>
					</IconButton>}


				<h2>Last played:</h2>
				{createHistory ? checkIsEmpty : <CircularProgress />}
			</div>
		</Popout>
	);
};

export default HistoryDialog;
