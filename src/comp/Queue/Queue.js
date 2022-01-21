import React, { useMemo } from "react";
import QueueItem from "./QueueItem";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

const useStyles = makeStyles({
	queue: {
		display: "flex",
		color: "white",
		flexDirection: "column",
		width: "95%",
		height: "fit-content",
		gap: "5px",
		padding: "0 0 20px 0",
		alignSelf: "center",
		"@media(max-width:720px)": {
			overflow: "scroll",
			maxHeight: "300px",
		},
	},
	queueList: {
		display: "flex",
		color: "white",
		flexDirection: "column",
		width: "100%",
		height: "fit-content",
		gap: "5px",
		padding: "0 0 20px 0",
		alignSelf: "center",
	},
});

const Queue = () => {
	const classes = useStyles();

	const { videoQueue } = useSelector((state) => state.player);

	const queueList = useMemo(
		() =>
			videoQueue.map((item, index) => {
				console.log("useMemo queue map");
				return (
					<CSSTransition key={index} timeout={300} classNames="transition">
						<QueueItem item={item} index={index} key={item.id} />
					</CSSTransition>
				);
			}),
		[videoQueue]
	);

	if (videoQueue.length === 0) {
		return (
			<Box className={classes.queue}>
				<div className="emptyQueueText">QUEUE IS EMPTY</div>
			</Box>
		);
	}

	return (
		<Box className={classes.queue}>
			<TransitionGroup className={classes.queueList}>
				{queueList}
			</TransitionGroup>
		</Box>
	);
};

export default Queue;
