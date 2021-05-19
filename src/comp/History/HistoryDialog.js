import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import React from "react";
import Popout from "../Popout";
import HistoryItem from "./HistoryItem";
import { CircularProgress } from "@material-ui/core";
const HistoryDialog = () => {
	const { isHistoryOpen, setIsHistoryOpen, socket } = useContext(DataContext);
	const [history, setHistory] = useState([]);
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

	const createHistory = history.map((video, index) => {
		const { URL, title } = video;
		return (
			<HistoryItem key={index} URL={URL} index={index}>
				<a href={URL} target="_blank" rel="noopener noreferrer">
					{title ? title : URL}
				</a>
			</HistoryItem>
		);
	});

	return (
		<Popout state={isHistoryOpen} setState={setIsHistoryOpen}>
			<div className="historyContainer">
				<h2>Last played:</h2>
				{createHistory ? createHistory : <CircularProgress />}
			</div>
		</Popout>
	);
};

export default HistoryDialog;
