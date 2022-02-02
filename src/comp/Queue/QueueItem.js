import React, { useContext } from "react";
import { DataContext } from "../../App";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CodeIcon from "@material-ui/icons/Code";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { Box, makeStyles, Tooltip, Typography, Zoom } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import "./Queue.css";
import noImg from "./noImg.jpg";
import { useSelector } from "react-redux";
import useTime from "../../Hooks/useTime";
import colors from "../../colors";

const useStyles = makeStyles({
	iconButton: {
		color: "white",
		transition: "0.3s",
	},
	typography: {
		fontWeight: "700",
		width: "max-content",
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
	imdbInfoBox: {
		display: "flex",
		alignItems: "center",
		gap: "15px",
		"@media (max-width:1000px)": {
			display: "none",
		},
	},
	queueItemDuration: {
		position: "absolute",
		backgroundColor: "black",
		borderRadius: "5px",
		padding: "2px 5px",
		fontSize: "15px",
		border: "1px solid",
		opacity: "0",
		animation: `$durationFadeIn ease-in 0.3s forwards`,
		color: ({ isLive }) => (isLive ? colors.red : "white"),
		borderColor: ({ isLive }) => (isLive ? colors.red : "black"),
	},
	iFrameButton: {
		color: "red",
	},
	"@keyframes durationFadeIn": {
		from: {
			opacity: "0",
			transform: "translate(175px, 110%)",
		},
		to: {
			opacity: 1,
			transform: "translate(162px, 110%)",
		},
	},
});

const QueueItem = ({ item, index }) => {
	const {
		URL,
		title,
		addedBy,
		thumbnail,
		duration,
		noData,
		iFrame,
		id,
		rating,
	} = item;

	const isLive = duration === "LIVE";
	const classes = useStyles({ isLive, iFrame });

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
				color: colors.green,
		  }
		: {
				color: "white",
		  };

	const checkThumbnail = thumbnail || noImg;

	const checkTitle = title || URL;

	const time = useTime(duration, true);

	const checkDuration = isLive ? "LIVE" : time;

	return (
		<>
			<Box className="queueItem">
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

					{duration && (
						<Box className={classes.queueItemDuration}>{checkDuration}</Box>
					)}

					{noData && !rating && (
						<Box className={classes.queueItemDuration}>No data</Box>
					)}

					{rating && (
						<Box className={classes.imdbInfoBox}>
							<Rating readOnly value={Math.floor(rating / 2)} />
						</Box>
					)}
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
			</Box>
		</>
	);
};

export default QueueItem;
