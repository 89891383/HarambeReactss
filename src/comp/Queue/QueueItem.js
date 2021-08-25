import React, { useContext } from "react";
import { DataContext } from "../../App";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CodeIcon from "@material-ui/icons/Code";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { Box, makeStyles, Tooltip, Typography, Zoom } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import "./Queue.css";
import noImg from "./noImg.jpg";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
	iconButton: {
		color: "white",
		transition: "0.3s",
	},
	typography: {
		fontWeight: "700",
	},
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3)",
		},
	},
});

const QueueItem = ({ item, index }) => {
	const classes = useStyles();

	const { URL, title, addedBy, thumbnail, duration, noData, iFrame, id } = item;

	const formatTime = (time) => {
		return time < 10 ? `0${time}` : time;
	};

	const convertSeconds = (time) => {
		if (typeof time !== "number") return false;

		let minutes = Math.floor(time / 60);
		let hours = Math.floor(minutes / 60);
		let seconds = Math.floor(time - 60 * minutes);
		minutes = formatTime(minutes % 60);
		hours = formatTime(hours);
		seconds = formatTime(seconds);
		return { seconds, minutes, hours };
	};

	const { seconds, minutes, hours } = convertSeconds(duration);

	const { admin } = useSelector((state) => state.player);

	const { socket } = useContext(DataContext);

	// STYLES FOR TEXT OVERFLOW EMPHASIS
	const queueItemStyle = admin
		? { width: "calc(100% - 225px)" }
		: { width: "95%" };

	const handleDeleteItemFromQueue = () => {
		if (admin) {
			socket.emit("deleteVideoFromQueue", id);
		}
	};

	const handlePlayNow = () => {
		if (admin) {
			socket.emit("playVideoNow", id);
		}
	};

	const handleMoveUp = () => {
		if (admin && index) {
			socket.emit("queueMoveUp", id);
		}
	};

	const handleiFrame = () => {
		if (admin) {
			socket.emit("iFrameVideoToggle", id);
		}
	};

	const iFrameStyles = iFrame
		? {
				color: "#90be6d",
		  }
		: {
				color: "white",
		  };

	const checkThumbnail = thumbnail || noImg;

	const checkTitle = title || URL;

	const checkDuration =
		duration === "LIVE" ? (
			<span className="live" style={{ padding: 0 }}>
				LIVE
			</span>
		) : (
			`${hours}:${minutes}:${seconds}`
		);

	return (
		<>
			<div className="queueItem">
				<div className="videoImgAndInfo_Container" style={queueItemStyle}>
					<div className="videoImg">
						<img src={checkThumbnail} alt="" srcSet="" />
					</div>

					<Tooltip
						title={`Added by: ${addedBy}`}
						placement="bottom"
						TransitionComponent={Zoom}
					>
						<Typography variant="h5" noWrap className={classes.typography}>
							<a href={URL} target="_blank" rel="noopener noreferrer">
								{checkTitle}
							</a>
						</Typography>
					</Tooltip>

					{duration && <div className="queueItemDuration">{checkDuration}</div>}

					{noData && <div className="queueItemDuration">No data</div>}
				</div>

				{admin && (
					<div className="queueItemButtons">
						<Box onClick={handlePlayNow} className={classes.box}>
							<Tooltip
								title="Play now"
								enterDelay={0}
								TransitionComponent={Zoom}
							>
								<PlayArrowIcon />
							</Tooltip>
						</Box>

						{index ? (
							<Box className={classes.box} onClick={handleMoveUp}>
								<Tooltip
									title={"Move up"}
									enterDelay={0}
									TransitionComponent={Zoom}
								>
									<ArrowUpwardIcon />
								</Tooltip>
							</Box>
						) : (
							false
						)}

						<Box
							className={classes.box}
							onClick={handleiFrame}
							style={iFrameStyles}
						>
							<Tooltip enterDelay={0} title="iFrame" TransitionComponent={Zoom}>
								<CodeIcon />
							</Tooltip>
						</Box>

						<Box className={classes.box} onClick={handleDeleteItemFromQueue}>
							<Tooltip
								enterDelay={0}
								title="Delete from queue"
								TransitionComponent={Zoom}
							>
								<DeleteForeverIcon />
							</Tooltip>
						</Box>
					</div>
				)}
			</div>
		</>
	);
};

export default QueueItem;
