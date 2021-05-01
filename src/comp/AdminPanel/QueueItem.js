import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../App";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { IconButton, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
	iconButton: {
		color: "white",
		transition: "0.3s",
		"&:hover": {
			color: "red",
		},
	},
});

const QueueItem = ({ item }) => {
	const classes = useStyles();
	const { URL, title } = item;
	const [videoTitle, setVideoTitle] = useState(null);

	const { admin, socket } = useContext(DataContext);

	useEffect(() => {
		fetch(`https://noembed.com/embed?url=${URL}`)
			.then((res) => res.json())
			.then((res) => {
				setVideoTitle(res.title);
			});
	}, [item, URL]);

	const handleDeleteItemFromQueue = () => {
		if (admin) {
			socket.emit("deleteVideoFromQueue", { URL });
		}
	};

	return (
		<>
			<div className="queueItem">
				<div>
					{/* {videoDuraton()} */}
					<a href={URL} target="_blank" rel="noopener noreferrer">
						{title ? title : videoTitle ? videoTitle : URL}
					</a>
				</div>
				{admin && (
					<IconButton
						className={classes.iconButton}
						onClick={handleDeleteItemFromQueue}
					>
						<DeleteForeverIcon />
					</IconButton>
				)}
			</div>
		</>
	);
};

export default QueueItem;
