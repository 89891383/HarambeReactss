import React, { useContext } from "react";
import { DataContext } from "../../App";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CodeIcon from "@material-ui/icons/Code";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { Box, makeStyles, Tooltip, Typography, Zoom } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import noImg from "./noImg.jpg";
import { useSelector } from "react-redux";
import useTime from "../../Hooks/useTime";
import colors from "../../colors";
import { sharedStyles } from "../../shared/styles";

const useStyles = makeStyles({
	queueItem: {
		padding: "5px",
		display: "flex",
		width: "100%",
		borderRadius: "10px",
		alignItems: "center",
		justifyContent: "space-between",
		fontWeight: "bold",
		backgroundColor: colors.queueItemBg,
		fontSize: "20px",
		border: `1px solid ${colors.borderGrey}`,
		height: "120px",
		overflow: "hidden",
	},
	itemDetails: {
		display: "flex",
		gap: "15px",
		flex: "1",
		overflow: "hidden",
		height: "100%",
	},
	thumbnail: {
		width: "150px",
		height: "auto",
		objectFit: "cover",
		"@media(max-width:600px)": {
			display: "none",
		},
	},
	itemTitle: {
		display: "flex",
		flex: 1,
		overflowX: "hidden",
		position: "relative",
		alignItems: "center",
		"@media(max-width:600px)": {
			marginLeft: "10px",
		},
	},
	iconButton: {
		color: "white",
		transition: "0.3s",
	},
	typography: {
		fontWeight: "700",
		width: "max-content",
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
		left: 0,
		transform: "translateY(120px)",
		backgroundColor: "black",
		width: "min-content",
		borderRadius: "5px",
		padding: "2px 5px",
		fontSize: "15px",
		border: "1px solid",
		opacity: "0",
		animation: `$durationFadeIn ease-in 0.3s forwards`,
		color: ({ isLive }) => (isLive ? colors.red : "white"),
		borderColor: ({ isLive }) => (isLive ? colors.red : "black"),
	},
	"@keyframes durationFadeIn": {
		from: {
			opacity: 0,
			transform: "translate(20px,30px)",
		},
		to: {
			opacity: 1,
			transform: "translate(0,30px)",
		},
	},
	queueItemButtons: {
		display: "flex",
		width: "fit-content",
		padding: "15px",
		gap: "10px",
		marginLeft: "auto",
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
			<Box className={classes.queueItem}>
				<Box className={classes.itemDetails}>
					{/* <div className="videoImg"> */}
					<img
						className={classes.thumbnail}
						src={checkThumbnail}
						alt="Video Thumbnail"
					/>
					{/* </div> */}
					<Box className={classes.itemTitle}>
						<Tooltip
							title={`Added by: ${addedBy}`}
							placement="bottom"
							TransitionComponent={Zoom}
						>
							<Typography variant="h5" noWrap className={classes.typography}>
								<a
									style={{ color: "inherit", textDecoration: "none" }}
									href={URL}
									target="_blank"
									rel="noopener noreferrer"
								>
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
					</Box>
				</Box>

				{admin && (
					<Box className={classes.queueItemButtons}>
						<Box onClick={handlePlayNow} sx={sharedStyles.box}>
							<Tooltip
								title="Play now"
								enterDelay={0}
								TransitionComponent={Zoom}
							>
								<PlayArrowIcon />
							</Tooltip>
						</Box>

						{Boolean(index) && (
							<Box sx={sharedStyles.box} onClick={handleMoveUp}>
								<Tooltip
									title={"Move up"}
									enterDelay={0}
									TransitionComponent={Zoom}
								>
									<ArrowUpwardIcon />
								</Tooltip>
							</Box>
						)}

						<Box
							sx={sharedStyles.box}
							onClick={handleiFrame}
							style={iFrameStyles}
						>
							<Tooltip enterDelay={0} title="iFrame" TransitionComponent={Zoom}>
								<CodeIcon />
							</Tooltip>
						</Box>

						<Box sx={sharedStyles.box} onClick={handleDeleteItemFromQueue}>
							<Tooltip
								enterDelay={0}
								title="Delete from queue"
								TransitionComponent={Zoom}
							>
								<DeleteForeverIcon />
							</Tooltip>
						</Box>
					</Box>
				)}
			</Box>
		</>
	);
};

export default QueueItem;
