import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../App";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import "./Queue.css";
import noImg from "./noImg.jpg";

const useStyles = makeStyles({
	iconButton: {
		color: "white",
		transition: "0.3s",
	},
});

const QueueItem = ({ item }) => {
	const classes = useStyles();
	const { URL, title, addedBy } = item;
	const [videoData, setVideoData] = useState(null);

	const { admin, socket } = useContext(DataContext);

	useEffect(() => {
		fetch(`https://noembed.com/embed?url=${URL}`)
			.then((res) => res.json())
			.then((res) => {
				setVideoData(res);
			});

		return () => {
			setVideoData(null);
		};
	}, [item, URL]);

	const handleDeleteItemFromQueue = () => {
		if (admin) {
			socket.emit("deleteVideoFromQueue", { URL });
		}
	};

	const handlePlayNow = () => {
		if (admin) {
			socket.emit("playVideoNow", { URL, title });
		}
	};

	return (
		<>
			<div className="queueItem">
				<div className="videoImgAndInfo_Container">
					<div className="videoImg">
						<img
							src={videoData?.thumbnail_url ? videoData?.thumbnail_url : noImg}
							alt=""
							srcset=""
						/>
					</div>
					<Tooltip title={`Added by: ${addedBy}`} placement="bottom">
						<div className="queueItemInfo">
							<a href={URL} target="_blank" rel="noopener noreferrer">
								{title ? title : videoData?.title ? videoData?.title : URL}
							</a>
						</div>
					</Tooltip>
				</div>

				{admin && (
					<div className="manageIcons">
						<IconButton className={classes.iconButton}>
							<Tooltip title="Play now" onClick={handlePlayNow} enterDelay={0}>
								<PlayArrowIcon />
							</Tooltip>
						</IconButton>
						<IconButton
							className={classes.iconButton}
							onClick={handleDeleteItemFromQueue}
						>
							<Tooltip enterDelay={0} title="Delete from queue">
								<DeleteForeverIcon />
							</Tooltip>
						</IconButton>
					</div>
				)}
			</div>
		</>
	);
};

export default QueueItem;
