import React, { useContext } from "react";
import { DataContext } from "../../App";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import "./Queue.css";
import noImg from "./noImg.jpg";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
	iconButton: {
		color: "white",
		transition: "0.3s",
	},
});

const QueueItem = ({ item,index }) => {
	const classes = useStyles();
	const { URL, title, addedBy, thumbnail, duration } = item;

	const {admin} = useSelector(state=> state.player)

	const { socket } = useContext(DataContext);

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

	const handleMoveUp = () =>{
		if(admin && index){
			socket.emit('queueMoveUp', {URL})
		}
	}

	const checkThumbnail = thumbnail || noImg
	
	const checkTitle = title || URL

	const checkDuration = duration === 'LIVE' ? 
	(<span className="live" style={{padding:0}} >
		LIVE
	</span>) : duration

	return (
		<>
			<div className="queueItem">
				<div className="videoImgAndInfo_Container">
					<div className="videoImg">
						<img
							src={checkThumbnail}
							alt=""
							srcSet=""
						/>
					</div>

				
						<Tooltip title={`Added by: ${addedBy}`} placement="bottom">
							<div className="queueItemInfo">
								<a href={URL} target="_blank" rel="noopener noreferrer">
									{checkTitle}
								</a>
							</div>
						</Tooltip>

						{duration && (
							<div className="queueItemDuration">
								{checkDuration}
							</div>
						) }
					

				


				</div>

				

				{admin && (
					<div className="manageIcons">
						<IconButton onClick={handlePlayNow} className={classes.iconButton}>
							<Tooltip title="Play now" enterDelay={0}>
								<PlayArrowIcon />
							</Tooltip>
						</IconButton>

						{index ?
							<IconButton className={classes.iconButton} onClick={handleMoveUp} >
							<Tooltip title={'Move up'} enterDelay={0} >
								<ArrowUpwardIcon/>
							</Tooltip>
							</IconButton> : false}


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
