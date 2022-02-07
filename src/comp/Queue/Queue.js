import React, { useMemo } from "react";
import QueueItem from "./QueueItem";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import colors from "../../colors";

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
	emptyQueue: {
		fontSize: "40px",
		fontWeight: "700",
		display: "flex",
		justifyContent: "center",
		color: "#242424",
		pointerEvents: "none",
		webkitUserSelect: "none",
		msUserSelect: "none",
		userSelect: "none",
		padding: "20px",
		letterSpacing: "1px",
		background: colors.queueItemBg,
		border: `1px solid ${colors.borderGrey}`,
		borderRadius: "5px",
	},
});

const Queue = () => {
	const classes = useStyles();

	const { videoQueue } = useSelector((state) => state.player);

	const queueList = useMemo(
		() =>
			videoQueue.map((item, index) => {
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
				<Box className={classes.emptyQueue}>QUEUE IS EMPTY</Box>
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
